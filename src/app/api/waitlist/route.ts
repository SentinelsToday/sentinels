import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { walletAddress, name, email, company } = await req.json();

    if (!walletAddress || !name || !email) {
      return NextResponse.json(
        { error: "walletAddress, name, and email are required" },
        { status: 400 }
      );
    }

    const existing = await db.waitlistEntry.findUnique({
      where: { walletAddress },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    await db.waitlistEntry.create({
      data: {
        walletAddress,
        name,
        email,
        company: company || null,
        status: "pending",
      },
    });

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
