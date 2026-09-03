import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next
) => {
    console.error(err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors && { errors: err.errors }),
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
