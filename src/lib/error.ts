import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}

export async function withErrorHandling<T>(fn:() => Promise <T>):Promise<T | NextResponse> {
    try {
        return await fn()
    } catch (error) {
        return handleApiError(error)
    }
}

export function handleApiError(err: unknown): NextResponse {
    if(err instanceof ZodError){
        return NextResponse.json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid Request Data",
                details: z.flattenError(err )
            }
        },{status: 422})
    }

    if(err instanceof AppError) {
        return NextResponse.json({
            success:false,
            error:{
                code: err.code,
                message: err.message
            }
        },{status: err.statusCode})
    }

    console.error("[UNHANDLED_ERROR]", err);

    return NextResponse.json({
        success: false,
        error: {
            code: "INTERNAL_ERROR",
            message: "Something went wrong"
        }
    },{status: 500})
}