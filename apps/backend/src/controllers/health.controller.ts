import type{ Request, Response } from "express";
import prisma from "../config/db";

export const healthCheck = async (
    req: Request,
    res: Response
) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({
            status: "ok",
            service: "AgentLens API",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error(
            "HEALTH CHECK ERROR:",
            error
        );

        return res.status(503).json({
            status: "error",
            service: "AgentLens API",
            database: "disconnected",
            timestamp: new Date().toISOString(),
        });
    }
};