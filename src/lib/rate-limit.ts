import { NextResponse } from "next/server";

// In-memory rate limiter (per-instance, resets on cold start)
// For production at scale, use Redis or Upstash
const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const LIMITS: Record<string, number> = {
  default: 60,
  telemetry: 120,
  register: 10,
  command: 30,
};

export function rateLimit(key: string, type: string = "default") {
  const limit = LIMITS[type] || LIMITS.default;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  entry.count++;
  return null;
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
