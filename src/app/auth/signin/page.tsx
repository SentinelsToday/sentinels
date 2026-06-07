"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, KeyRound, Wallet, CheckCircle2, Loader2 } from "lucide-react";

type Step = "auth" | "waitlist" | "success";

interface SolanaProvider {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  signMessage?: (message: Uint8Array, display?: "utf8" | "hex") => Promise<{ signature: Uint8Array }>;
}

function getSolanaProvider(): SolanaProvider | undefined {
  return (window as unknown as { solana?: SolanaProvider }).solana;
}

function toBase64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export default function SignInPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("auth");
  const [walletAddress, setWalletAddress] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { apiKey, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid API key");
    }
  }

  async function handleWalletSignIn() {
    setLoading(true);
    setError("");
    try {
      const sol = getSolanaProvider();
      if (!sol?.connect || !sol.signMessage) {
        window.open("https://phantom.app/", "_blank");
        setError("No Solana wallet found. Install Phantom or Backpack.");
        setLoading(false);
        return;
      }

      const resp = await sol.connect();
      const address = resp.publicKey.toString();

      const challengeRes = await fetch(`/api/auth/challenge?publicKey=${encodeURIComponent(address)}`);
      if (!challengeRes.ok) {
        setError("Could not request sign-in challenge.");
        setLoading(false);
        return;
      }
      const { message } = await challengeRes.json();

      const messageBytes = new TextEncoder().encode(message);
      const { signature } = await sol.signMessage(messageBytes, "utf8");

      const signInRes = await signIn("wallet", {
        publicKey: address,
        signature: toBase64(signature),
        message,
        redirect: false,
      });

      setLoading(false);
      if (signInRes?.ok) {
        router.push("/dashboard");
      } else {
        setError("Signature did not verify. Try again.");
      }
    } catch (e: unknown) {
      setLoading(false);
      const err = e as { code?: number; message?: string };
      if (err?.code === 4001) {
        setError("Wallet signature rejected.");
      } else {
        setError(err?.message || "Wallet sign-in failed.");
      }
    }
  }

  async function handleWaitlistConnect() {
    setLoading(true);
    setError("");
    try {
      const sol = getSolanaProvider();
      if (!sol?.connect) {
        window.open("https://phantom.app/", "_blank");
        setError("No Solana wallet found. Install Phantom or Backpack.");
        setLoading(false);
        return;
      }
      const resp = await sol.connect();
      setWalletAddress(resp.publicKey.toString());
      setStep("waitlist");
    } catch (e: unknown) {
      const err = e as { code?: number };
      setError(err?.code === 4001 ? "Wallet connection rejected" : "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, name, email, company }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setStep("success");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto px-4">
          {step === "auth" && (
            <>
              <div className="text-center mb-8">
                <Shield className="h-8 w-8 text-sentinels mx-auto mb-3" strokeWidth={2} />
                <h1 className="text-2xl font-bold text-foreground">Sign in to Sentinels</h1>
                <p className="mt-2 text-sm text-muted-foreground">Access your fleet dashboard</p>
              </div>

              <form onSubmit={handleCredentials} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="apiKey" className="font-mono text-xs uppercase tracking-wider text-steel">
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_..."
                    className="mt-1.5 font-mono text-sm"
                  />
                </div>
                {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading || !apiKey}
                  className="w-full font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-white h-10"
                >
                  <KeyRound className="mr-1.5 h-4 w-4" />
                  {loading ? "Authenticating..." : "Sign In with API Key"}
                </Button>
              </form>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-steel">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                onClick={handleWalletSignIn}
                disabled={loading}
                className="w-full font-mono text-sm bg-foreground hover:bg-foreground/90 text-background h-10"
              >
                <Wallet className="mr-1.5 h-4 w-4" />
                {loading ? "Signing in..." : "Sign In with Wallet"}
              </Button>

              <Button
                variant="outline"
                onClick={handleWaitlistConnect}
                disabled={loading}
                className="w-full font-mono text-sm h-10 mt-3"
              >
                Request Early Access
              </Button>

              <p className="mt-6 text-center text-[11px] text-muted-foreground font-mono">
                Enterprise SSO available on Fleet and Enterprise plans.
              </p>
            </>
          )}

          {step === "waitlist" && (
            <>
              <div className="text-center mb-8">
                <Wallet className="h-8 w-8 text-sentinels mx-auto mb-3" strokeWidth={2} />
                <h1 className="text-2xl font-bold text-foreground">Request Early Access</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Connected as{" "}
                  <span className="font-mono text-sentinels">{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
                </p>
              </div>

              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-steel">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-1.5 font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-steel">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="font-mono text-xs uppercase tracking-wider text-steel">
                    Company <span className="text-steel/50">(optional)</span>
                  </Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company or project"
                    className="mt-1.5 font-mono text-sm"
                  />
                </div>
                {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading || !name || !email}
                  className="w-full font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-white h-10"
                >
                  {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Wallet className="mr-1.5 h-4 w-4" />}
                  {loading ? "Submitting..." : "Join the Waitlist"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("auth")}
                  className="w-full font-mono text-xs text-muted-foreground"
                >
                  Back
                </Button>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sentinels/10 mb-6">
                <CheckCircle2 className="h-8 w-8 text-sentinels" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">You&apos;re on the list!</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                We&apos;re working on granting you access as soon as possible.
              </p>
              <p className="text-xs text-muted-foreground mt-4 font-mono">
                We&apos;ll reach out at{" "}
                <span className="text-sentinels">{email}</span>
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="mt-8 font-mono text-sm"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
