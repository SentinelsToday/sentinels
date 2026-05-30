import { NextRequest, NextResponse } from "next/server";

const ROLES = ["viewer", "operator", "admin"] as const;

const PERMISSIONS: Record<string, string[]> = {
  admin: ["read", "write", "command", "delete", "manage_users"],
  operator: ["read", "write", "command"],
  viewer: ["read"],
};

export function hasPermission(role: string, action: string): boolean {
  return PERMISSIONS[role]?.includes(action) ?? false;
}

export function requireRole(role: string, minimumRole: string): boolean {
  const roleIndex = ROLES.indexOf(role as any);
  const minIndex = ROLES.indexOf(minimumRole as any);
  if (roleIndex === -1 || minIndex === -1) return false;
  return roleIndex >= minIndex;
}

export function withAuth(
  handler: (req: NextRequest, ctx: any) => Promise<NextResponse>,
  minimumRole: string
) {
  return async (req: NextRequest, ctx: any) => {
    const role = req.headers.get("x-user-role") || "";
    if (!requireRole(role, minimumRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(req, ctx);
  };
}
