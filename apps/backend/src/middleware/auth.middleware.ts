import type{
    Request,
    Response,
    NextFunction,
} from "express";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const [scheme, token] =
            authHeader.split(" ");

        if (
            scheme !== "Bearer" ||
            !token
        ) {
            return res.status(401).json({
                message:
                    "Invalid authorization header",
            });
        }

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        if (
            typeof decoded !== "object" ||
            !("userId" in decoded)
        ) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        req.userId = decoded.userId as string;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};