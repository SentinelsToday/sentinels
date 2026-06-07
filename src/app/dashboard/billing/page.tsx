"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  address,
  createSolanaRpc,
  type Address,
  type Instruction,
} from "@solana/kit";
import {
  findPlanPda,
  findSubscriptionAuthorityPda,
  findSubscriptionDelegationPda,
  fetchMaybePlan,
  fetchMaybeSubscriptionAuthority,
  fetchMaybeSubscriptionDelegation,
  getInitSubscriptionAuthorityInstructionAsync,
  getSubscribeInstructionAsync,
} from "@solana/subscriptions";
import { TOKEN_PROGRAM_ADDRESS, findAssociatedTokenPda } from "@solana-program/token";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle2, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import {
  SOLANA_RPC_URL,
  NETWORK,
  mintFor,
  type TierKey,
  type TokenKey,
  TIERS,
} from "@/lib/subscriptions";
import { getWallet, sendInstructionsViaWallet } from "@/lib/wallet-tx";

type Stage = "idle" | "preflight" | "signing" | "sending" | "confirmed" | "error";

function tokenIs(value: string | null): value is TokenKey {
  return value === "USDC" || value === "SENT";
}

function tierIs(value: string | null): value is TierKey {
  return value === "starter" || value === "fleet" || value === "enterprise";
}

function solscanUrl(sig: string) {
  const cluster = NETWORK === "mainnet-beta" ? "" : `?cluster=${NETWORK}`;
  return `https://solscan.io/tx/${sig}${cluster}`;
}

function BillingContent() {
  const params = useSearchParams();
  const router = useRouter();

  const tier = params.get("tier");
  const token = params.get("token");
  const planIdRaw = params.get("planId");
  const subscriberFromQuery = params.get("subscriber");

  const [stage, setStage] = useState<Stage>("idle");
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [merchantAddr, setMerchantAddr] = useState<Address | null>(null);

  useEffect(() => {
    fetch("/api/subscriptions/plans")
      .then((r) => r.json())
      .then((data) => {
        if (data.merchant) setMerchantAddr(address(data.merchant));
      })
      .catch(() => undefined);
  }, []);

  const validParams =
    tierIs(tier) && tokenIs(token) && planIdRaw && subscriberFromQuery && tier !== "enterprise";

  const subscribe = async () => {
    if (!validParams || !tierIs(tier) || !tokenIs(token)) return;
    if (!merchantAddr) {
      setStage("error");
      setMessage("Merchant address not configured on the server.");
      return;
    }
    const wallet = getWallet();
    if (!wallet?.signAndSendTransaction) {
      setStage("error");
      setMessage("Install Phantom or Backpack to continue.");
      return;
    }

    try {
      setStage("preflight");
      setMessage("Connecting wallet...");
      const { publicKey: connected } = await wallet.connect();
      const subscriberStr = connected.toString();
      localStorage.setItem("sentinels-subscriber", subscriberStr);
      if (subscriberStr !== subscriberFromQuery) {
        setStage("error");
        setMessage(
          `Connected wallet ${subscriberStr.slice(0, 4)}... does not match the wallet that started checkout. Reconnect with the same wallet or restart from /pricing.`,
        );
        return;
      }
      const subscriber = address(subscriberStr);

      const planId = BigInt(planIdRaw!);
      const mint = mintFor(token);
      if (!mint) {
        setStage("error");
        setMessage(`${token} mint not configured on this network.`);
        return;
      }

      const rpc = createSolanaRpc(SOLANA_RPC_URL);
      const [planPda] = await findPlanPda({ owner: merchantAddr, planId });

      setMessage("Checking plan on-chain...");
      const plan = await fetchMaybePlan(rpc, planPda);
      if (!plan.exists) {
        setStage("error");
        setMessage(
          "This plan has not been provisioned on-chain yet. Ask the merchant to run scripts/create-plans.ts.",
        );
        return;
      }

      const [delegationPda] = await findSubscriptionDelegationPda({ planPda, subscriber });
      const existingDelegation = await fetchMaybeSubscriptionDelegation(rpc, delegationPda);
      if (existingDelegation.exists) {
        setStage("confirmed");
        setMessage("You are already subscribed to this plan.");
        return;
      }

      const [authorityPda] = await findSubscriptionAuthorityPda({
        user: subscriber,
        tokenMint: mint,
      });

      const [userAta] = await findAssociatedTokenPda({
        mint,
        owner: subscriber,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });

      const instructions: Instruction[] = [];

      const subscriberSigner = { address: subscriber } as unknown as Parameters<
        typeof getInitSubscriptionAuthorityInstructionAsync
      >[0]["owner"];

      const existingAuthority = await fetchMaybeSubscriptionAuthority(rpc, authorityPda);
      let authInitId: bigint;
      if (!existingAuthority.exists) {
        setMessage("Preparing subscription authority + subscribe transaction...");
        const initIx = await getInitSubscriptionAuthorityInstructionAsync({
          owner: subscriberSigner,
          tokenMint: mint,
          userAta,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
        });
        instructions.push(initIx);
        authInitId = 0n;
      } else {
        setMessage("Preparing subscribe transaction...");
        authInitId = existingAuthority.data.initId;
      }

      const subscribeIx = await getSubscribeInstructionAsync({
        subscriber: subscriberSigner as unknown as Parameters<
          typeof getSubscribeInstructionAsync
        >[0]["subscriber"],
        merchant: merchantAddr,
        planPda,
        subscriptionAuthorityPda: authorityPda,
        subscribeData: {
          planId,
          planBump: plan.data.bump,
          expectedMint: plan.data.data.mint,
          expectedAmount: plan.data.data.terms.amount,
          expectedPeriodHours: plan.data.data.terms.periodHours,
          expectedCreatedAt: plan.data.data.terms.createdAt,
          expectedSubscriptionAuthorityInitId: authInitId,
        },
      });
      instructions.push(subscribeIx);

      setStage("signing");
      setMessage("Sign the transaction in your wallet to authorize the recurring charge.");
      const sig = await sendInstructionsViaWallet({
        rpcUrl: SOLANA_RPC_URL,
        wallet,
        payer: subscriber,
        instructions,
      });

      setStage("confirmed");
      setSignature(sig);
      setMessage(
        `Subscription created. The merchant will pull ${TIERS[tier].name} fees automatically each billing cycle.`,
      );
    } catch (e: unknown) {
      const err = e as { message?: string; code?: number };
      setStage("error");
      if (err?.code === 4001) {
        setMessage("You rejected the transaction in your wallet.");
      } else {
        setMessage(err?.message || "Subscription failed.");
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="text-center mb-8">
        <Wallet className="h-8 w-8 text-sentinels mx-auto mb-3" strokeWidth={2} />
        <h1 className="text-2xl font-bold text-foreground">Confirm subscription</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {NETWORK} · Solana Subscriptions
        </p>
      </div>

      {!validParams && (
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-3" />
          <p className="text-sm text-foreground">
            Missing checkout parameters. Start from the{" "}
            <button
              onClick={() => router.push("/pricing")}
              className="text-sentinels hover:underline"
            >
              pricing page
            </button>
            .
          </p>
        </div>
      )}

      {validParams && tierIs(tier) && tokenIs(token) && (
        <div className="rounded-lg border border-border bg-white p-6 space-y-5">
          <div className="border-b border-border pb-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-steel">Plan</span>
              <span className="font-semibold text-foreground">{TIERS[tier].name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-steel">Pay in</span>
              <span className="font-mono text-sm text-foreground">
                {token}{token === "SENT" && " (20% off)"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-steel">Billing</span>
              <span className="font-mono text-sm text-foreground">Every 30 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-steel">
                Subscriber
              </span>
              <span className="font-mono text-xs text-foreground">
                {subscriberFromQuery!.slice(0, 4)}...{subscriberFromQuery!.slice(-4)}
              </span>
            </div>
          </div>

          {stage === "idle" && (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Confirming will authorize the merchant program-controlled authority to pull funds
                from your wallet each billing cycle. You can revoke this authorization any time
                from your wallet.
              </p>
              <Button
                onClick={subscribe}
                className="w-full font-mono text-sm h-11 bg-sentinels hover:bg-sentinels-muted text-white"
              >
                Confirm & Subscribe
              </Button>
            </>
          )}

          {(stage === "preflight" || stage === "signing" || stage === "sending") && (
            <div className="text-center py-6">
              <Loader2 className="h-6 w-6 text-sentinels mx-auto mb-3 animate-spin" />
              <p className="text-sm text-foreground">{message}</p>
            </div>
          )}

          {stage === "confirmed" && (
            <div className="text-center py-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" strokeWidth={2} />
              <p className="text-sm text-foreground mb-4">{message}</p>
              {signature && (
                <a
                  href={solscanUrl(signature)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-sentinels hover:underline"
                >
                  View transaction <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="font-mono text-sm"
                >
                  Go to dashboard
                </Button>
              </div>
            </div>
          )}

          {stage === "error" && (
            <div className="text-center py-4">
              <AlertTriangle className="h-7 w-7 text-red-500 mx-auto mb-3" strokeWidth={2} />
              <p className="text-sm text-foreground mb-4">{message}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setStage("idle");
                  setMessage("");
                }}
                className="font-mono text-sm"
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 flex items-center justify-center py-12">
        <Suspense
          fallback={
            <div className="text-center py-12">
              <Loader2 className="h-6 w-6 text-sentinels mx-auto animate-spin" />
            </div>
          }
        >
          <BillingContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
