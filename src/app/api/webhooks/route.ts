import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const fleetId = request.nextUrl.searchParams.get("fleetId");
  if (!fleetId) {
    return NextResponse.json({ error: "fleetId required" }, { status: 400 });
  }
  const webhooks = await db.webhook.findMany({ where: { fleetId } });
  return NextResponse.json(webhooks);
}

export async function POST(request: NextRequest) {
  const { fleetId, url, secret, events } = await request.json();
  if (!fleetId || !url || !secret) {
    return NextResponse.json({ error: "fleetId, url, secret required" }, { status: 400 });
  }
  const webhook = await db.webhook.create({
    data: { fleetId, url, secret, events: JSON.stringify(events ?? []) },
  });
  return NextResponse.json(webhook, { status: 201 });
}
