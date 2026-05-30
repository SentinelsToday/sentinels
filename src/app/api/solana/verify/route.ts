import { NextRequest, NextResponse } from "next/server";
import { verifyOnChainProof } from "@/lib/solana";

export async function POST(req: NextRequest) {
  try {
    const { txSignature } = await req.json();

    if (!txSignature) {
      return NextResponse.json({ error: "txSignature is required" }, { status: 400 });
    }

    const result = await verifyOnChainProof(txSignature);
    if (!result) {
      return NextResponse.json({ error: "Transaction not found or verification failed" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
