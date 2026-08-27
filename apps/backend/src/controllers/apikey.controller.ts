import type{ Request, Response } from "express";
import crypto from "crypto";

import prisma from "../config/db";

export const createApiKey = async (
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

        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "API key name is required",
            });
        }

        // Make sure the project belongs
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

        // Generate the actual secret.
        const secret =
            crypto.randomBytes(32).toString("hex");

        /*
         * The user will see this key only once.
         *
         * Example:
         *
         * al_live_abc123...
         */
        const apiKey =
            `al_live_${secret}`;

        // Prefix is useful for identifying
        // a key without exposing the secret.
        const keyPrefix =
            apiKey.substring(0, 16);

        // Hash the complete secret before
        // storing it in the database.
        const keyHash =
            crypto
                .createHash("sha256")
                .update(apiKey)
                .digest("hex");

        const createdKey =
            await prisma.apiKey.create({
                data: {
                    name: name.trim(),
                    keyHash,
                    keyPrefix,
                    projectId,
                },
            });

        return res.status(201).json({
            message: "API key created successfully",

            apiKey: {
                id: createdKey.id,
                name: createdKey.name,
                key: apiKey,
                keyPrefix: createdKey.keyPrefix,
                createdAt: createdKey.createdAt,
            },
        });

    } catch (error) {
        console.error(
            "CREATE API KEY ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to create API key",
        });
    }
};

export const getApiKeys = async(req: Request, res:Response)=>{
    try{
        const projectId = req.params.id;
        const userId = req.userId;

        if(!userId){
            return  res.status(401).json({
                message:"Authentication Required",
            });
        }

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId,
            },
        });

        if(!project){
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const apiKeys = await prisma.apiKey.findMany({
            where:{
                projectId,
            },
            select:{
                id: true,
                name: true,
                keyPrefix: true,
                createdAt: true,
                lastUsedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            apiKeys,
        });

    }catch(error){
        console.error(
            "get api key error"
        );

        return res.status(500).json({
            message: "Failed to fetch API keys",
        });

    }
};

export const deleteApiKey = async(req:Request, res: Request)=>{
    try{
        const projectId = req.params.id;
        const keyId = req.params.keyId;
        const userId = req.userId;


        if(!userId){
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const project = await prisma.project.findFirst({
            where:{
                id: projectId,
                userId,
            },
        });

        if(!project){
            return res.status(404).json({
                message:"project not found" ,
            });
        }

        const apiKey= await prisma.apiKey.findFirst({
            where:{
                id: keyId,
                projectId,
            },
        });

        if(!apiKey){
            return res.status(404).json({
                message:"Api key not found",
            });
        }

        await prisma.apiKey.delete({
            where: {
                id: keyId,
            },
        }); 

        return res.status(200).json({
            message: "Api key revoked successfully",
        });

    }catch(error){
        console.error(
            "Delete api key  error",
            error
        );

        return res.status(500).json({
            message: "Failed to revoke API key",
        });

    }
}