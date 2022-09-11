import { StatusCodes } from "http-status-codes"

export class ApiError {
    public readonly message: string;
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }

    static notFound(message: string) {
        throw new ApiError(message, StatusCodes.NOT_FOUND);
    }

    static unauthorized(message: string) {
        throw new ApiError(message, StatusCodes.UNAUTHORIZED);
    }

    static badRequest(message: string) {
        throw new ApiError(message, StatusCodes.BAD_REQUEST);
    }
}
