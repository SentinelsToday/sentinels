import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuth } from "@/lib/rbac";

export const GET = withAuth(async () => {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}, "admin");

export const POST = withAuth(async (req: NextRequest) => {
  const { email, name, role } = await req.json();
  if (!email || !["admin", "operator", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const user = await db.user.create({ data: { email, name, role } });
  return NextResponse.json(user, { status: 201 });
}, "admin");
