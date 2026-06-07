import { NextResponse } from "next/server";
import {
  TIERS,
  type TierKey,
  type TokenKey,
  priceForTier,
  formatTokenAmount,
  MERCHANT_ADDRESS,
  PLAN_IDS,
  NETWORK,
  SUBSCRIPTIONS_PROGRAM_ID,
  USDC_MINT,
  SENT_MINT,
  BILLING_PERIOD_HOURS,
  SENT_DISCOUNT_BPS,
} from "@/lib/subscriptions";

export async function GET() {
  const tiers = (Object.keys(TIERS) as TierKey[]).map((tier) => {
    const cfg = TIERS[tier];
    const tokens = (["USDC", "SENT"] as TokenKey[]).map((token) => {
      const amountBase = priceForTier(tier, token);
      const planId = PLAN_IDS[tier][token];
      return {
        token,
        planId: planId === null ? null : planId.toString(),
        amountBase: amountBase === null ? null : amountBase.toString(),
        amountDisplay: amountBase === null ? "Custom" : formatTokenAmount(amountBase, token),
        discountBps: token === "SENT" ? SENT_DISCOUNT_BPS : 0,
      };
    });
    return {
      tier,
      name: cfg.name,
      usdMonthly: cfg.usdMonthly,
      robotLimit: cfg.robotLimit,
      perks: cfg.perks,
      tokens,
    };
  });

  return NextResponse.json({
    network: NETWORK,
    programId: SUBSCRIPTIONS_PROGRAM_ID,
    merchant: MERCHANT_ADDRESS,
    mints: { USDC: USDC_MINT, SENT: SENT_MINT },
    billingPeriodHours: BILLING_PERIOD_HOURS.toString(),
    tiers,
  });
}
