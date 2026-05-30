import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, any> = {};
  if (body.url !== undefined) data.url = body.url;
  if (body.events !== undefined) data.events = JSON.stringify(body.events);
  if (body.active !== undefined) data.active = body.active;

  const webhook = await db.webhook.update({ where: { id }, data });
  return NextResponse.json(webhook);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.webhook.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
