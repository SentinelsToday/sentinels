import { NextResponse } from "next/server";
import { getStatus } from "@/lib/solana";

export async function GET() {
  try {
    const status = await getStatus();
    return NextResponse.json(status);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
