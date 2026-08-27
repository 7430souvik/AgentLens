import { Router } from "express";

import { ingestEvent,getProjectEvents, getEventById,getProjectStats,getProjectCost,getProjectErrors,
    getProjectTraces,
    getTraceById,
    analyzeEventById,
    getEventAnalysis
} from "../controllers/event.controller";

import { apiKeyMiddleware } from "../middleware/apiKey.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
    "/ingest",
    apiKeyMiddleware,
    ingestEvent
);

router.get(
    "/projects/:id/events",
    authMiddleware,
    getProjectEvents
);
router.get(
    "/projects/:id/events/:eventId",
    authMiddleware,
    getEventById
);

router.get(
    "/projects/:id/stats",
    authMiddleware,
    getProjectStats
);


router.get(
    "/projects/:id/errors",
    authMiddleware,
    getProjectErrors
);

router.get(
    "/projects/:id/cost",
    authMiddleware,
    getProjectCost
);

router.get(
    "/projects/:id/traces",
    authMiddleware,
    getProjectTraces
);

router.get(
    "/projects/:id/traces/:traceId",
    authMiddleware,
    getTraceById
);

router.post(
    "/projects/:id/events/:eventId/analyze",
    authMiddleware,
    analyzeEventById
);
router.get(
    "/projects/:id/events/:eventId/analysis",
    authMiddleware,
    getEventAnalysis
);
export default router;