import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuth } from "@/lib/rbac";

export const PUT = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { role } = await req.json();
  if (!["admin", "operator", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  const user = await db.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json(user);
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, { params }: { params: { id: string } }) => {
  await db.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}, "admin");
