export class AppError extends Error {
    statusCode: number;
    errors?: unknown[];

    constructor(
        message: string,
        statusCode: number,
        errors?: unknown[]
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = "AppError";

        Object.setPrototypeOf(this, AppError.prototype);
    }
}
