/**
 * One-time script to create on-chain Subscription Plans for Sentinels.
 *
 * Usage (devnet):
 *   MERCHANT_PRIVATE_KEY="[1,2,...,64]" \
 *   NEXT_PUBLIC_SOLANA_NETWORK=devnet \
 *   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com \
 *   NEXT_PUBLIC_SENT_MINT=<devnet SENT mint> \
 *   bun scripts/create-plans.ts
 *
 * Re-running is safe: a plan that already exists at its PDA is skipped.
 */

import { address, createKeyPairSignerFromBytes, createSolanaRpc } from "@solana/kit";
import {
  findPlanPda,
  fetchMaybePlan,
} from "@solana/subscriptions";
import {
  TIERS,
  PLAN_IDS,
  USDC_MINT,
  SENT_MINT,
  BILLING_PERIOD_HOURS,
  SOLANA_RPC_URL,
  type TierKey,
  type TokenKey,
  priceForTier,
} from "../src/lib/subscriptions";

async function main() {
  const raw = process.env.MERCHANT_PRIVATE_KEY;
  if (!raw) {
    console.error("MERCHANT_PRIVATE_KEY env var required (JSON byte array, 64 bytes)");
    process.exit(1);
  }
  const bytes = Uint8Array.from(JSON.parse(raw));
  const merchant = await createKeyPairSignerFromBytes(bytes);

  if (!SENT_MINT) {
    console.error("NEXT_PUBLIC_SENT_MINT env var required");
    process.exit(1);
  }

  const rpc = createSolanaRpc(SOLANA_RPC_URL);

  console.info(`Merchant: ${merchant.address}`);
  console.info(`RPC: ${SOLANA_RPC_URL}`);
  console.info(`USDC mint: ${USDC_MINT}`);
  console.info(`SENT mint: ${SENT_MINT}`);
  console.info("---");

  for (const tier of Object.keys(TIERS) as TierKey[]) {
    for (const token of ["USDC", "SENT"] as TokenKey[]) {
      const planId = PLAN_IDS[tier][token];
      const amount = priceForTier(tier, token);
      if (planId == null || amount == null) {
        console.info(`skip ${tier}/${token}: enterprise tier — contact sales`);
        continue;
      }

      const mint = token === "USDC" ? USDC_MINT : SENT_MINT;
      const [planPda] = await findPlanPda({ owner: merchant.address, planId });

      const existing = await fetchMaybePlan(rpc, planPda);
      if (existing.exists) {
        console.info(`exists ${tier}/${token} planId=${planId} pda=${planPda}`);
        continue;
      }

      console.info(`would create ${tier}/${token} planId=${planId} amount=${amount} mint=${mint}`);
      console.info(`  pda=${planPda} period=${BILLING_PERIOD_HOURS}h`);

      // To actually broadcast, install @solana/subscriptions client builder
      // and replace this stub:
      //
      //   await merchantClient.subscriptions.instructions.createPlan({
      //     planId, mint, amount, periodHours: BILLING_PERIOD_HOURS,
      //     endTs: 0n, destinations: [merchant.address], pullers: [merchant.address],
      //     metadataUri: `https://sentinels.today/plans/${tier}-${token.toLowerCase()}.json`,
      //   }).sendTransaction();
    }
  }

  console.info("---");
  console.info("Dry run complete. Wire the createPlan transaction send to go live.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
