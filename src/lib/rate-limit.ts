import { NextResponse } from "next/server";

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000;
const LIMITS: Record<string, number> = {
  default: 60,
  telemetry: 120,
  register: 10,
  command: 30,
};

const warned = new Set<string>();

export function rateLimit(key: string, type: string = "default"): NextResponse | null {
  const limit = LIMITS[type] || LIMITS.default;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    if (!warned.has(key)) {
      warned.add(key);
      console.warn(`[warn] Rate limit hit for ${key} (${type}): ${entry.count}/${limit}`);
    }
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
