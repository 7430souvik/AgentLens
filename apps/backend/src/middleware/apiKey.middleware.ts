import type{ Request, Response, NextFunction } from "express";
import crypto from "crypto";
import prisma from "../config/db";

export const apiKeyMiddleware = async(req, res, next)=>{
    try{
        console.log("AUTHORIZATION HEADER:", req.headers.authorization);
        console.log("ALL HEADERS:", req.headers);

        
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                message:"Api key required",
            });
        }

        const apiKey = authHeader.split(" ")[1];

        if(!apiKey){
            return res.status(401).json({
                message:"Api key required",
            });
        }

        const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

        const key = await prisma.apiKey.findUnique({
            where:{
                keyHash,
            },
        });

        if(!key){
            return res.status(401).json({
                message:"Invalid api key",
            });
        }

        await prisma.apiKey.update({
            where:{
                id: key.id,
            },
            data:{
                lastUsedAt: new Date(),
            },
        });

        req.projectId = key.projectId;

        next();

    }catch(error){
        console.error(
            "API KEY AUTH ERROR:",
            error
        );

    }

}