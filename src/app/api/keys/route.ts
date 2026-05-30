import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function GET() {
  const fleets = await db.fleet.findMany();
  const keys = fleets
    .filter((f: any) => f.apiKey)
    .map((f: any) => ({
      id: f.id,
      name: f.name,
      maskedKey: "•".repeat(24) + f.apiKey.slice(-8),
      createdAt: f.createdAt,
    }));
  return NextResponse.json(keys);
}

export async function POST(req: Request) {
  const { fleetId, name } = await req.json();
  if (!fleetId) return NextResponse.json({ error: "fleetId required" }, { status: 400 });

  const apiKey = `sk_${crypto.randomUUID().replace(/-/g, "")}`;
  await db.fleet.update({ where: { id: fleetId }, data: { apiKey, name: name || undefined } });

  return NextResponse.json({ apiKey, fleetId });
}
