import { NextRequest, NextResponse } from "next/server";
import { anchorProof } from "@/lib/solana";

export async function POST(req: NextRequest) {
  try {
    const { robotId, proofType, hash } = await req.json();

    if (!robotId || !proofType || !hash) {
      return NextResponse.json({ error: "robotId, proofType, and hash are required" }, { status: 400 });
    }

    if (!["firmware", "identity", "audit"].includes(proofType)) {
      return NextResponse.json({ error: "proofType must be firmware, identity, or audit" }, { status: 400 });
    }

    const result = await anchorProof(hash, robotId, proofType);
    if (!result) {
      return NextResponse.json({ error: "Failed to anchor proof on Solana" }, { status: 503 });
    }

    return NextResponse.json({ ...result, hash, proofType });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
