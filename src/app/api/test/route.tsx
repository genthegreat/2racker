import { rateLimitMiddleware } from "@/utils/rateLimiter";
import { NextRequest, NextResponse } from "next/server";

// Handle GET requests
export async function GET(request: NextRequest) {
    const rateLimitError = await rateLimitMiddleware(request)
    if (rateLimitError) return rateLimitError;

    const message = "Test route";
    const json = {
        message,
    };

    return NextResponse.json(json, { status: 200 });
}