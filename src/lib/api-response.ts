import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiResponseMeta {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
}

export interface ApiErrorDetails {
    code: string;
    message: string;
    details?: unknown;
}

export type ApiResponse<T = unknown> = {
    data?: T;
    meta?: ApiResponseMeta;
    error?: ApiErrorDetails;
};

export function successResponse<T>(data: T, meta?: ApiResponseMeta, status = 200) {
    return NextResponse.json(
        { data, meta, error: null },
        { status }
    );
}

export function errorResponse(
    message: string,
    code = 'INTERNAL_ERROR',
    status = 500,
    details?: unknown
) {
    return NextResponse.json(
        { data: null, meta: null, error: { code, message, details } },
        { status }
    );
}

export function handleApiError(error: unknown) {
    // Log error for debugging (will be removed in production)
    if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', error);
    }

    if (error instanceof ZodError) {
        return errorResponse(
            'Validation Failed',
            'VALIDATION_ERROR',
            400,
            error.issues
        );
    }

    if (error instanceof Error) {
        if (error.message.includes('NOT_FOUND')) {
            return errorResponse(error.message, 'NOT_FOUND', 404);
        }

        return errorResponse(
            error.message,
            'INTERNAL_SERVER_ERROR',
            500
        );
    }

    // Handle unknown error types
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : 'Internal Server Error';

    const errorCode = typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : 'INTERNAL_SERVER_ERROR';

    return errorResponse(errorMessage, errorCode, 500);
}
