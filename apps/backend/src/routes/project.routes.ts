import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { createProject, getProjectById, getProjects,getProjectOverview
 } from "../controllers/project.controller";
 import { getProjectEvents } from "../controllers/event.controller";

const router = Router();

router.post(
    "/",
    authMiddleware,
    createProject
);

router.get(
    "/",
    authMiddleware,
    getProjects
);

router.get(
    "/:id",
    authMiddleware,
    getProjectById
);

router.get(
    "/:id/events",
    authMiddleware,
    getProjectEvents
);

router.get(
    "/:id/overview",
    authMiddleware,
    getProjectOverview
);


export default router;

