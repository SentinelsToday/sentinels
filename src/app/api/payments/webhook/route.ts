import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const stripe = await getStripe();
  const body = await req.text();

  if (stripe && process.env.STRIPE_WEBHOOK_SECRET) {
    const sig = req.headers.get("stripe-signature")!;
    try {
      const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      if (event.type === "checkout.session.completed") {
        console.log("[stripe] checkout completed:", event.data.object);
      }
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  } else {
    console.log("[stripe-mock] webhook received");
  }

  return NextResponse.json({ received: true });
}
