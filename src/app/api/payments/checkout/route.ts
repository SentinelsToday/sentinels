import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS, PlanKey } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { plan, email } = (await req.json()) as { plan: PlanKey; email: string };

  if (!plan || !email || !PLANS[plan] || PLANS[plan].price === null) {
    return NextResponse.json({ error: "Invalid plan or email" }, { status: 400 });
  }

  const stripe = await getStripe();
  if (!stripe) {
    return NextResponse.json({ url: "/pricing?success=true" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [{ price_data: { currency: "usd", product_data: { name: `Sentinels ${plan}` }, unit_amount: PLANS[plan].price! * 100, recurring: { interval: "month" } }, quantity: 1 }],
    success_url: `${req.nextUrl.origin}/pricing?success=true`,
    cancel_url: `${req.nextUrl.origin}/pricing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
