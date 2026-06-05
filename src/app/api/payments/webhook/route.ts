import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const stripe = await getStripe();
    const body = await req.text();

    if (stripe && process.env.STRIPE_WEBHOOK_SECRET) {
      const sig = req.headers.get("stripe-signature");
      if (!sig) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
      }
      const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      if (event.type === "checkout.session.completed") {
        console.info("[stripe] checkout completed:", event.data.object);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
