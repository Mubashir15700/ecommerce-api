import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/user.model";
import { AppError } from "../utils/app-error";

interface JwtPayload {
    userId: string;
    role: UserRole;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authenticate = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        next(new AppError("Authentication required", 401));
        return;
    }

    const token = authorization.split(" ")[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        next(new AppError("JWT_SECRET is not defined", 500));
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.user = decoded;

        next();
    } catch {
        next(new AppError("Invalid or expired token", 401));
    }
};

export const authorize = (...allowedRoles: UserRole[]) => {
    return (
        req: AuthenticatedRequest,
        _res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            next(new AppError("Authentication required", 401));
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            next(new AppError("Access denied", 403));
            return;
        }

        next();
    };
};
