import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_STATUSES = ["downloading", "installing", "completed", "failed"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; updateId: string }> }) {
  const { updateId } = await params;
  const { status } = await req.json();

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const data: Record<string, any> = { status };
  if (status === "downloading" || status === "installing") data.startedAt = new Date().toISOString();
  if (status === "completed" || status === "failed") data.completedAt = new Date().toISOString();

  const updated = await db.softwareUpdate.update({ where: { id: updateId }, data });
  return NextResponse.json(updated);
}
