import type { Request, Response } from "express";
import prisma from "../config/db";
import { analyzeEvent } from "../services/ai.service";

export const getProjectEvents = async(req:Request, res:Response) =>{
    try{
        const userId = req.userId;
        const projectId = req.params.id;

        if(!userId){
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        if(!projectId){
            return res.status(400).json({
                message: "projectId is required"

            });
        }

        const project = await prisma.project.findFirst({
            where:{
                id: projectId,
                userId
            }

        });

        if(!project){
            return res.status(404).json({
                message: "project not found"
            });
        }

        // -----------------------------
        // Pagination
        // -----------------------------

        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(req.query.limit) || 20,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        // -----------------------------
        // Filters
        // -----------------------------

        const status =
            typeof req.query.status === "string"
                ? req.query.status
                : undefined;

        const type =
            typeof req.query.type === "string"
                ? req.query.type
                : undefined;

        let fromDate: Date | undefined;
        let toDate: Date | undefined;

        const from =
            typeof req.query.from === "string"
                ? req.query.from
                : undefined;

        const to =
            typeof req.query.to === "string"
                ? req.query.to
                : undefined;

        if (from) {
            fromDate = new Date(`${from}T00:00:00.000Z`);
        }

        if (to) {
            toDate = new Date(`${to}T23:59:59.999Z`);
        }

        const where = {
            projectId,

            ...(status && {
                status,
            }),

            ...(type && {
                type,
            }),

            ...(fromDate || toDate
                ? {
                    createdAt: {
                        ...(fromDate && {
                            gte: fromDate,
                        }),

                        ...(toDate && {
                            lte: toDate,
                        }),
                    },
                }
                : {}),
        };
        // -----------------------------
        // Fetch events + count
        // -----------------------------

        const [events, total] =
            await Promise.all([
                prisma.event.findMany({
                    where,

                    orderBy: {
                        createdAt: "desc",
                    },

                    skip,

                    take: limit,
                }),

                prisma.event.count({
                    where,
                }),
            ]);

        const totalPages =
            Math.ceil(total / limit);

        return res.status(200).json({
            events,

            pagination: {
                page,
                limit,
                total,
                totalPages,

                hasNextPage:
                    page < totalPages,

                hasPreviousPage:
                    page > 1,
            },
        });


    } catch (error) {
        console.error(
            "GET PROJECT EVENTS ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch events"
        });
    }
};
export const ingestEvent = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.projectId;

        if (!projectId) {
            return res.status(401).json({
                message: "Project authentication required",
            });
        }

        const {
            name,
            type,
            traceId,
            spanId,
            status,
            duration,
            model,
            inputTokens,
            outputTokens,
            cost,
            errorMessage,
            errorStack,
            payload,
            output,
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Event name is required",
            });
        }

        if (!type) {
            return res.status(400).json({
                message: "Event type is required",
            });
        }

        const event = await prisma.event.create({
            data: {
                projectId,

                name,
                type,

                traceId: traceId ?? null,
                spanId: spanId ?? null,

                status: status ?? null,
                duration: duration ?? null,

                model: model ?? null,

                inputTokens:
                    inputTokens ?? null,

                outputTokens:
                    outputTokens ?? null,

                cost:
                    cost ?? null,

                errorMessage:
                    errorMessage ?? null,

                errorStack:
                    errorStack ?? null,

                payload:
                    payload ?? null,

                output:
                    output ?? null,
            },
        });

        return res.status(201).json({
            message: "Event ingested successfully",
            event: {
                id: event.id,
                name: event.name,
                type: event.type,
                createdAt: event.createdAt,
            },
        });

    } catch (error) {
        console.error(
            "INGEST EVENT ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to ingest event",
        });
    }
};

export const getEventById = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const eventId = req.params.eventId;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId || !eventId) {
            return res.status(400).json({
                message: "Project ID and Event ID are required",
            });
        }

        // First verify that the project belongs
        // to the authenticated user.
        const project =
            await prisma.project.findFirst({
                where: {
                    id: projectId,
                    userId,
                },
            });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const event =
            await prisma.event.findFirst({
                where: {
                    id: eventId,
                    projectId,
                },
            });

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        return res.status(200).json({
            event,
        });

    } catch (error) {
        console.error(
            "GET EVENT ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch event",
        });
    }
};

export const getProjectStats = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required",
            });
        }

        // Verify project ownership
        const project =
            await prisma.project.findFirst({
                where: {
                    id: projectId,
                    userId,
                },
            });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const events =
            await prisma.event.findMany({
                where: {
                    projectId,
                },
                select: {
                    status: true,
                    duration: true,
                    inputTokens: true,
                    outputTokens: true,
                    cost: true,
                },
            });

        const totalEvents = events.length;

        const errorCount = events.filter(
            (event) =>
                event.status === "error"
        ).length;

        const successCount = events.filter(
            (event) =>
                event.status === "success"
        ).length;

        const durations = events
            .map((event) => event.duration)
            .filter(
                (duration): duration is number =>
                    duration !== null
            );

        const totalDuration = durations.reduce(
            (sum, duration) =>
                sum + duration,
            0
        );

        const averageLatency =
            durations.length > 0
                ? totalDuration /
                  durations.length
                : 0;

        const totalInputTokens =
            events.reduce(
                (sum, event) =>
                    sum +
                    (event.inputTokens ?? 0),
                0
            );

        const totalOutputTokens =
            events.reduce(
                (sum, event) =>
                    sum +
                    (event.outputTokens ?? 0),
                0
            );

        const totalCost =
            events.reduce(
                (sum, event) =>
                    sum +
                    (event.cost ?? 0),
                0
            );

        const errorRate =
            totalEvents > 0
                ? (errorCount / totalEvents) * 100
                : 0;

        const successRate =
            totalEvents > 0
                ? (successCount / totalEvents) * 100
                : 0;

        return res.status(200).json({
            stats: {
                totalEvents,

                errors: errorCount,

                successCount,

                errorRate:
                    Number(
                        errorRate.toFixed(2)
                    ),

                successRate:
                    Number(
                        successRate.toFixed(2)
                    ),

                averageLatency:
                    Number(
                        averageLatency.toFixed(2)
                    ),

                totalInputTokens,

                totalOutputTokens,

                totalTokens:
                    totalInputTokens +
                    totalOutputTokens,

                totalCost:
                    Number(
                        totalCost.toFixed(6)
                    ),
            },
        });

    } catch (error) {
        console.error(
            "GET PROJECT STATS ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch project stats",
        });
    }
};

export const getProjectErrors = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required",
            });
        }

        // Verify project ownership
        const project =
            await prisma.project.findFirst({
                where: {
                    id: projectId,
                    userId,
                },
            });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const errors =
            await prisma.event.findMany({
                where: {
                    projectId,
                    status: "error",
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    traceId: true,
                    spanId: true,
                    model: true,
                    duration: true,
                    errorMessage: true,
                    errorStack: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        return res.status(200).json({
            errors,
        });

    } catch (error) {
        console.error(
            "GET PROJECT ERRORS ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch project errors",
        });
    }
};

export const getProjectCost = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required",
            });
        }

        // Verify project ownership
        const project =
            await prisma.project.findFirst({
                where: {
                    id: projectId,
                    userId,
                },
            });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const events =
            await prisma.event.findMany({
                where: {
                    projectId,
                    type: "llm",
                },
                select: {
                    model: true,
                    inputTokens: true,
                    outputTokens: true,
                    cost: true,
                },
            });

        const totalCost = events.reduce(
            (sum, event) =>
                sum + (event.cost ?? 0),
            0
        );

        const totalInputTokens =
            events.reduce(
                (sum, event) =>
                    sum +
                    (event.inputTokens ?? 0),
                0
            );

        const totalOutputTokens =
            events.reduce(
                (sum, event) =>
                    sum +
                    (event.outputTokens ?? 0),
                0
            );

        // Group cost by model
        const modelMap = new Map<
            string,
            {
                requests: number;
                inputTokens: number;
                outputTokens: number;
                cost: number;
            }
        >();

        for (const event of events) {
            const model =
                event.model || "unknown";

            const existing =
                modelMap.get(model) || {
                    requests: 0,
                    inputTokens: 0,
                    outputTokens: 0,
                    cost: 0,
                };

            existing.requests += 1;

            existing.inputTokens +=
                event.inputTokens ?? 0;

            existing.outputTokens +=
                event.outputTokens ?? 0;

            existing.cost +=
                event.cost ?? 0;

            modelMap.set(
                model,
                existing
            );
        }

        const byModel = Array.from(
            modelMap.entries()
        ).map(
            ([model, data]) => ({
                model,
                requests: data.requests,
                inputTokens:
                    data.inputTokens,
                outputTokens:
                    data.outputTokens,
                totalTokens:
                    data.inputTokens +
                    data.outputTokens,
                cost: Number(
                    data.cost.toFixed(6)
                ),
            })
        );

        return res.status(200).json({
            cost: {
                totalCost: Number(
                    totalCost.toFixed(6)
                ),

                totalInputTokens,

                totalOutputTokens,

                totalTokens:
                    totalInputTokens +
                    totalOutputTokens,

                totalRequests:
                    events.length,

                byModel,
            },
        });

    } catch (error) {
        console.error(
            "GET PROJECT COST ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch project cost",
        });
    }
};

export const getProjectTraces = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required",
            });
        }

        const project =
            await prisma.project.findFirst({
                where: {
                    id: projectId,
                    userId,
                },
            });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const events =
            await prisma.event.findMany({
                where: {
                    projectId,
                    traceId: {
                        not: null,
                    },
                },
                select: {
                    traceId: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        const traceMap = new Map<
            string,
            {
                traceId: string;
                eventCount: number;
                firstEvent: Date;
                lastEvent: Date;
            }
        >();

        for (const event of events) {
            if (!event.traceId) {
                continue;
            }

            const existing =
                traceMap.get(event.traceId);

            if (!existing) {
                traceMap.set(event.traceId, {
                    traceId: event.traceId,
                    eventCount: 1,
                    firstEvent: event.createdAt,
                    lastEvent: event.createdAt,
                });

                continue;
            }

            existing.eventCount += 1;

            if (
                event.createdAt <
                existing.firstEvent
            ) {
                existing.firstEvent =
                    event.createdAt;
            }

            if (
                event.createdAt >
                existing.lastEvent
            ) {
                existing.lastEvent =
                    event.createdAt;
            }
        }

        const traces = Array.from(
            traceMap.values()
        ).map((trace) => ({
            traceId: trace.traceId,

            eventCount:
                trace.eventCount,

            startedAt:
                trace.firstEvent,

            endedAt:
                trace.lastEvent,

            duration:
                trace.lastEvent.getTime() -
                trace.firstEvent.getTime(),
        }));

        return res.status(200).json({
            traces,
        });

    } catch (error) {
        console.error(
            "GET PROJECT TRACES ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch traces",
        });
    }
};

export const getTraceById = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const traceId = req.params.traceId;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId || !traceId) {
            return res.status(400).json({
                message:
                    "Project ID and trace ID are required",
            });
        }

        const project =
            await prisma.project.findFirst({
                where: {
                    id: projectId,
                    userId,
                },
            });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const events =
            await prisma.event.findMany({
                where: {
                    projectId,
                    traceId,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

        if (events.length === 0) {
            return res.status(404).json({
                message: "Trace not found",
            });
        }

        const totalDuration =
            events.reduce(
                (sum, event) =>
                    sum + (event.duration ?? 0),
                0
            );

        const totalCost =
            events.reduce(
                (sum, event) =>
                    sum + (event.cost ?? 0),
                0
            );

        const totalInputTokens =
            events.reduce(
                (sum, event) =>
                    sum +
                    (event.inputTokens ?? 0),
                0
            );

        const totalOutputTokens =
            events.reduce(
                (sum, event) =>
                    sum +
                    (event.outputTokens ?? 0),
                0
            );

        const hasError =
            events.some(
                (event) =>
                    event.status === "error"
            );

        return res.status(200).json({
            trace: {
                traceId,

                eventCount:
                    events.length,

                totalDuration,

                totalCost: Number(
                    totalCost.toFixed(6)
                ),

                totalInputTokens,

                totalOutputTokens,

                totalTokens:
                    totalInputTokens +
                    totalOutputTokens,

                status: hasError
                    ? "error"
                    : "success",

                events,
            },
        });

    } catch (error) {
        console.error(
            "GET TRACE ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch trace",
        });
    }
};

export const analyzeEventById = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const eventId = req.params.eventId;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId || !eventId) {
            return res.status(400).json({
                message:
                    "Project ID and Event ID are required",
            });
        }

        const event =
            await prisma.event.findFirst({
                where: {
                    id: eventId,
                    projectId: projectId,

                    // Make sure the project
                    // belongs to the logged-in user
                    project: {
                        userId: userId,
                    },
                },

                include: {
                    analysis: true,
                },
            });

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        // Return existing analysis
        if (event.analysis) {
            return res.status(200).json({
                analysis: event.analysis,
                cached: true,
            });
        }

        // Send event to the LLM
        const analysis =
            await analyzeEvent({
                name: event.name,
                type: event.type,
                status: event.status,
                duration: event.duration,
                model: event.model,
                inputTokens:
                    event.inputTokens,
                outputTokens:
                    event.outputTokens,
                errorMessage:
                    event.errorMessage,
                errorStack:
                    event.errorStack,
                payload: event.payload,
            });

        // Save AI analysis
        const savedAnalysis =
            await prisma.eventAnalysis.create({
                data: {
                    eventId: event.id,
                    summary: analysis.summary,
                    rootCause: analysis.rootCause,
                    impact: analysis.impact,
                    recommendation:
                        analysis.recommendation,
                    severity: analysis.severity,
                },
            });

        return res.status(200).json({
            analysis: savedAnalysis,
            cached: false,
        });

    } catch (error) {
        console.error(
            "ANALYZE EVENT ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to analyze event",
        });
    }
};
export const getEventAnalysis = async (
    req: Request,
    res: Response
) => {
    try {
        const projectId = req.params.id;
        const eventId = req.params.eventId;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!projectId || !eventId) {
            return res.status(400).json({
                message:
                    "Project ID and Event ID are required",
            });
        }

        const event =
            await prisma.event.findFirst({
                where: {
                    id: eventId,
                    projectId: projectId,
                    project: {
                        userId: userId,
                    },
                },

                include: {
                    analysis: true,
                },
            });

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        if (!event.analysis) {
            return res.status(404).json({
                message:
                    "No AI analysis exists for this event",
            });
        }

        return res.status(200).json({
            analysis: event.analysis,
        });

    } catch (error) {
        console.error(
            "GET EVENT ANALYSIS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch event analysis",
        });
    }
};