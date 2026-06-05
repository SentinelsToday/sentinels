import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const ROLES = ["viewer", "operator", "admin"] as const;
type Role = (typeof ROLES)[number];

const PERMISSIONS: Record<Role, string[]> = {
  admin: ["read", "write", "command", "delete", "manage_users"],
  operator: ["read", "write", "command"],
  viewer: ["read"],
};

export function hasPermission(role: string, action: string): boolean {
  return PERMISSIONS[role as Role]?.includes(action) ?? false;
}

export function requireRole(role: string, minimumRole: string): boolean {
  const roleIndex = ROLES.indexOf(role as Role);
  const minIndex = ROLES.indexOf(minimumRole as Role);
  if (roleIndex === -1 || minIndex === -1) return false;
  return roleIndex >= minIndex;
}

export async function withAuth(
  handler: (req: NextRequest, ctx: { params?: Record<string, string> }) => Promise<NextResponse>,
  minimumRole: string
) {
  return async (req: NextRequest, ctx: { params?: Record<string, string> }) => {
    const token = await getToken({ req });
    const role = (token?.role as string) || "";
    if (!requireRole(role, minimumRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(req, ctx);
  };
}
