import { NextResponse } from "next/server";
import { getIPFSStats } from "@/lib/ipfs";

export async function GET() {
  return NextResponse.json(getIPFSStats());
}
