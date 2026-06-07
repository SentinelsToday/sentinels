import { NextResponse } from "next/server";
import { issueChallenge } from "@/lib/auth-challenge";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const publicKey = url.searchParams.get("publicKey");
  if (!publicKey) {
    return NextResponse.json({ error: "publicKey is required" }, { status: 400 });
  }
  return NextResponse.json(issueChallenge(publicKey));
}
