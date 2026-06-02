"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/sentinel/header";
import { Footer } from "@/components/sentinel/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, KeyRound, Wallet } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function handleWalletConnect() {
    setLoading(true);
    setError("");
    try {
      const sol = (window as any).solana;
      if (!sol?.connect) {
        window.open("https://phantom.app/", "_blank");
        setError("No Solana wallet found. Install Phantom or Backpack.");
        setLoading(false);
        return;
      }

      const resp = await sol.connect();
      const publicKey = resp.publicKey.toString();

      const message = new TextEncoder().encode(
        `Sign in to Sentinel Robotics\nNonce: ${crypto.randomUUID()}\nTimestamp: ${Date.now()}`
      );
      const signed = await sol.signMessage(message, "utf8");
      const signature = Buffer.from(signed.signature).toString("base64");

      const res = await signIn("wallet", {
        publicKey,
        signature,
        message: new TextDecoder().decode(message),
        redirect: false,
      });
      setLoading(false);
      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setError("Wallet authentication failed");
      }
    } catch (e: any) {
      setLoading(false);
      if (e?.code === 4001) {
        setError("Wallet connection rejected");
      } else {
        setError("Wallet connection failed");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto px-4">
          <div className="text-center mb-8">
            <Shield className="h-8 w-8 text-sentinel mx-auto mb-3" strokeWidth={2} />
            <h1 className="text-2xl font-bold text-foreground">Sign in to Sentinel</h1>
            <p className="mt-2 text-sm text-muted-foreground">Access your fleet dashboard</p>
          </div>

          {/* API Key Auth */}
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
              className="w-full font-mono text-sm bg-sentinel hover:bg-sentinel-muted text-white h-10"
            >
              <KeyRound className="mr-1.5 h-4 w-4" />
              {loading ? "Authenticating..." : "Sign In with API Key"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-steel">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Wallet Auth */}
          <Button
            variant="outline"
            onClick={handleWalletConnect}
            disabled={loading}
            className="w-full font-mono text-sm h-10"
          >
            <Wallet className="mr-1.5 h-4 w-4" />
            Connect Wallet
          </Button>

          <p className="mt-6 text-center text-[11px] text-muted-foreground font-mono">
            Enterprise SSO available on Fleet and Enterprise plans.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
