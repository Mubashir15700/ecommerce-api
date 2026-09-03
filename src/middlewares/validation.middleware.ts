import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/app-error";

export const validate = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.type === "field" ? error.path : "unknown",
            message: error.msg,
        }));

        next(new AppError("Validation failed", 400, formattedErrors));
        return;
    }

    next();
};
