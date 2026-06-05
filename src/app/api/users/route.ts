import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role } = body;

    if (!email || !["admin", "operator", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const user = await db.user.create({ data: { email, name, role } });
    return NextResponse.json(user, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
