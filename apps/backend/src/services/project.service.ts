import type { Request, Response } from "express";
import prisma from "../config/db";

interface CreateProjectData {
    name: string;
    description?: string;
    userId: string;
}

interface UpdateProjectData {
    name?: string;
    description?: string;
}

export const createProject = async (
    req: Request,
    res: Response
) => {
    try {
        const { name } = req.body;
        const userId = req.userId;

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
            message: "Failed to create project"
        });
    }
};

export const getProjects = async (
    userId: string
) => {
    return prisma.Project.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getProjectById = async (
    projectId: string,
    userId: string
) => {
    return prisma.Project.findFirst({
        where: {
            id: projectId,
            userId,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const updateProject = async (
    projectId: string,
    userId: string,
    data: UpdateProjectData
) => {
    // First make sure the project belongs to the user
    const existingProject =
        await prisma.project.findFirst({
            where: {
                id: projectId,
                userId,
            },
        });

    if (!existingProject) {
        return null;
    }

    let slug = existingProject.slug;

    if (data.name) {
        slug = data.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    return prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            ...(data.name && {
                name: data.name,
                slug,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const deleteProject = async (
    projectId: string,
    userId: string
) => {
    const existingProject =
        await prisma.project.findFirst({
            where: {
                id: projectId,
                userId,
            },
        });

    if (!existingProject) {
        return null;
    }

    await prisma.project.delete({
        where: {
            id: projectId,
        },
    });

    return true;
};