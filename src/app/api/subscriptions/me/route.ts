import { NextResponse } from "next/server";
import { address, createSolanaRpc } from "@solana/kit";
import {
  findPlanPda,
  findSubscriptionDelegationPda,
  fetchMaybeSubscriptionDelegation,
  fetchMaybePlan,
} from "@solana/subscriptions";
import {
  MERCHANT_ADDRESS,
  PLAN_IDS,
  SOLANA_RPC_URL,
  TIERS,
  type TierKey,
  type TokenKey,
} from "@/lib/subscriptions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subscriberRaw = url.searchParams.get("subscriber");
  if (!subscriberRaw) {
    return NextResponse.json({ error: "subscriber wallet address is required" }, { status: 400 });
  }
  if (!MERCHANT_ADDRESS) {
    return NextResponse.json({ error: "Merchant address not configured" }, { status: 503 });
  }

  let subscriber;
  try {
    subscriber = address(subscriberRaw);
  } catch {
    return NextResponse.json({ error: "Invalid subscriber address" }, { status: 400 });
  }

  const rpc = createSolanaRpc(SOLANA_RPC_URL);
  const subscriptions: Array<{
    tier: TierKey;
    token: TokenKey;
    planId: string;
    planPda: string;
    delegationPda: string;
    active: boolean;
  }> = [];

  for (const tier of Object.keys(TIERS) as TierKey[]) {
    for (const token of ["USDC", "SENT"] as TokenKey[]) {
      const planId = PLAN_IDS[tier][token];
      if (planId == null) continue;

      const [planPda] = await findPlanPda({ owner: MERCHANT_ADDRESS, planId });
      const [delegationPda] = await findSubscriptionDelegationPda({
        planPda,
        subscriber,
      });
      const delegation = await fetchMaybeSubscriptionDelegation(rpc, delegationPda);
      if (delegation.exists) {
        const plan = await fetchMaybePlan(rpc, planPda);
        subscriptions.push({
          tier,
          token,
          planId: planId.toString(),
          planPda,
          delegationPda,
          active: plan.exists,
        });
      }
    }
  }

  return NextResponse.json({ subscriber, subscriptions });
}
