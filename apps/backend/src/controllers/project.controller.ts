import type { Request, Response } from "express";
import prisma from "../config/db";

export const createProject = async (
    req: Request,
    res: Response
) => {
    try {
        const { name } = req.body;
        const userId = req.userId;

        console.log("CREATE PROJECT USER:", userId);

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        if (!name) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
         if (!slug) {
            return res.status(400).json({
                message: "Invalid project name",
            });
        }

        const existingProject =
            await prisma.project.findFirst({
                where: {
                    slug,
                    userId,
                },
            });
        if (existingProject) {
            return res.status(409).json({
                message:
                    "A project with this name already exists",
            });
        }

        const project = await prisma.project.create({
            data: {
                name,
                slug,
                userId
            }
        });

        return res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("CREATE PROJECT ERROR:", error);

        return res.status(500).json({
            message: "Failed to create project",
            error: error instanceof Error
                ? error.message
                : String(error)
        });
    }
};

export const getProjects = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.userId;

        console.log(
            "CURRENT USER ID:",
            userId
        );

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const projects = await prisma.project.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        console.log(
            "PROJECTS FOR CURRENT USER:",
            projects
        );

        return res.status(200).json({
            projects
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch projects"
        });
    }
};

export const getProjectById = async(
    req: Request,
    res: Response 
) =>{
    try{
        const userId = req.userId;
        const projectId = req.params.id;

        if(!userId){
            return res.status(401).json({
                message: "unauthorize"
            });
        }

        if(!projectId){
            return res.status(400).json({
                message:"project ID required"
            });
        }

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: userId
            }
        });

        if(!project){
            return res.status(404).json({
                message:"project not found"
            });
        }

        return res.status(200).json({
            project
        });

    }
    catch(error){
        console.error(error);

    }
};

export const getProjectOverview = async (
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
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        // Get all events needed for dashboard metrics
        const events =
            await prisma.event.findMany({
                where: {
                    projectId,
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    status: true,
                    duration: true,
                    model: true,
                    inputTokens: true,
                    outputTokens: true,
                    cost: true,
                    errorMessage: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
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

        const averageLatency =
            durations.length > 0
                ? durations.reduce(
                      (sum, duration) =>
                          sum + duration,
                      0
                  ) / durations.length
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

        const recentEvents =
            events.slice(0, 10);

        const recentErrors =
            events
                .filter(
                    (event) =>
                        event.status === "error"
                )
                .slice(0, 5);

        const eventTypeCounts =
                events.reduce(
                    (acc, event) => {
                        acc[event.type] =
                            (acc[event.type] ?? 0) + 1;

                        return acc;
                    },
                    {} as Record<string, number>
                );


        const eventBreakdown = Object.entries(
                eventTypeCounts
            ).map(([type, count]) => ({
                type,
                count,
                percentage:
                    totalEvents > 0
                        ? Number(
                            (
                                (count / totalEvents) *
                                100
                            ).toFixed(1)
                        )
                        : 0,
            }));
        
        const modelCounts =
            events.reduce(
                (acc, event) => {
                    if (event.model) {
                        acc[event.model] =
                            (acc[event.model] ?? 0) + 1;
                    }

                    return acc;
                },
                {} as Record<string, number>
            );

        const models = Object.entries(
            modelCounts
        ).map(([name, requests]) => ({
            name,
            requests,
            percentage:
                totalEvents > 0
                    ? Number(
                        (
                            (requests / totalEvents) *
                            100
                        ).toFixed(1)
                    )
                    : 0,
        }));

        const now = new Date();

        const requestVolume = Array.from(
            { length: 24 },
            (_, index) => {
                const hourStart = new Date(now);

                hourStart.setMinutes(0, 0, 0);
                hourStart.setHours(
                    now.getHours() - (23 - index)
                );

                const hourEnd = new Date(hourStart);

                hourEnd.setHours(
                    hourEnd.getHours() + 1
                );

                const count = events.filter(
                    (event) =>
                        event.createdAt >= hourStart &&
                        event.createdAt < hourEnd
                ).length;

                return {
                    time: hourStart.toLocaleTimeString(
                        "en-US",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }
                    ),
                    count,
                };
            }
        );

        return res.status(200).json({
        project,

        stats: {
            totalEvents,
            successCount,
            errorCount,

            successRate:
                Number(
                    successRate.toFixed(2)
                ),

            errorRate:
                Number(
                    errorRate.toFixed(2)
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

        requestVolume,

        eventBreakdown,
        models,

        recentEvents,

        recentErrors,
    });
    } catch (error) {
        console.error(
            "GET PROJECT OVERVIEW ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch project overview",
        });
    }
};