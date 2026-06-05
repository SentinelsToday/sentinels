import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/api/auth",
  "/api/robots/register",
  "/api/waitlist",
  "/_next/static",
  "/favicon.ico",
  "/logo.jpg",
];

const STATIC_EXTENSIONS = /\.(jpg|jpeg|png|gif|svg|ico|css|js|woff2?)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (STATIC_EXTENSIONS.test(pathname)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    const apiKey = req.headers.get("x-api-key");
    const authHeader = req.headers.get("authorization");

    if (apiKey === process.env.SENTINELS_ADMIN_KEY) return NextResponse.next();

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      if (token === process.env.SENTINELS_ADMIN_KEY) return NextResponse.next();
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
