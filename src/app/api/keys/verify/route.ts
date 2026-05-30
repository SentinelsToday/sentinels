import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { apiKey } = await req.json();
  if (!apiKey) return NextResponse.json({ error: "apiKey required" }, { status: 400 });

  const fleet = await db.fleet.findFirst({ where: { apiKey } });
  if (!fleet) return NextResponse.json({ valid: false }, { status: 401 });

  return NextResponse.json({ valid: true, fleet: { id: fleet.id, name: fleet.name } });
}
