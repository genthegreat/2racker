import { NextRequest, NextResponse } from "next/server";

const idToRequestCount = new Map<
  string,
  { count: number; lastReset: number }
>();
const rateLimiter = {
  windowSize: 3600 * 1000, // 1 hour window
  maxRequests: 5, // Max 5 requests per window
};

// Middleware to limit requests per IP
export const rateLimitMiddleware = async (req: NextRequest) => {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const routePath = req.nextUrl.pathname; // Use the request path to differentiate routes
  const key = `${ip}:${routePath}`; // Combine IP and route path to form a unique key

  if (!idToRequestCount.has(key)) {
    idToRequestCount.set(key, { count: 0, lastReset: Date.now() });
  }

  const ipData = idToRequestCount.get(key)!;
  console.log(`Ip Data for ${key} is`, ipData);

  const now = Date.now();
  if (now - ipData.lastReset > rateLimiter.windowSize) {
    ipData.count = 0;
    ipData.lastReset = now;
  }

  if (ipData.count >= rateLimiter.maxRequests) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  ipData.count += 1;

  return null; // No rate limiting issue, proceed
};
