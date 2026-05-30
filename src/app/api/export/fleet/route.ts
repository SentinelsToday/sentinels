import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const format = new URL(req.url).searchParams.get("format") || "json";

  const robots = await db.robot.findMany({ orderBy: { createdAt: "desc" } });

  if (format === "csv") {
    const header = "id,name,serialNumber,did,status,trustScore,createdAt";
    const rows = robots.map((r: any) =>
      [r.id, `"${r.name}"`, r.serialNumber, r.did, r.status, r.trustScore, r.createdAt].join(",")
    );
    const csv = [header, ...rows].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=fleet-export.csv",
      },
    });
  }

  return NextResponse.json(robots);
}
