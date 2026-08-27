import { Router } from "express";


import { createApiKey,getApiKeys,deleteApiKey } from "../controllers/apikey.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
    "/projects/:id/keys",
    authMiddleware,
    createApiKey
);

router.get(
    "/projects/:id/keys",
    authMiddleware,
    getApiKeys
);

router.delete(
    "/projects/:id/keys/:keyId",
    authMiddleware,
    deleteApiKey
);

export default router;