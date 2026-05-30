import { NextRequest, NextResponse } from "next/server";
import { anchorProof } from "@/lib/chains";

export async function POST(req: NextRequest) {
  const { chain, robotId, hash, type } = await req.json();
  const result = await anchorProof(chain, { robotId, hash, type });
  return NextResponse.json({ ...result, status: result.txId === "failed" ? "failed" : "anchored" });
}
