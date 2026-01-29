import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client"
function globalErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errorSources: any = err;

    //Prisma validation error 
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid or missing fields in the request body";
    }

    //Prisma Known request errors 
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409;
                const field = (err.meta?.target as string[])?.join(", ") || "field";
                message = `Duplicate entry:this ${field} already exists.`;
                break;
            case "P2003":
                statusCode = 400;
                message = "The provided ID for a relationship is invalid.";
                break;
            case "P2025":
                statusCode = 404;
                message = "The record you are trying,but not found";
                break;
            default:
                message = `Database Error: ${err.message}`;
        }
    }

    //Prisma connection issues 
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 503;
        message = "Database is not found.try again";
    }

    else if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
}

export default globalErrorHandler;