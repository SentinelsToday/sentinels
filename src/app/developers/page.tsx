"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import {
  Terminal,
  Code2,
  BookOpen,
  Webhook,
  KeyRound,
  Boxes,
  Cpu,
  Activity,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const sdks = [
  { name: "Rust", description: "Primary SDK for robotics runtime, edge devices, and embedded systems. Zero-cost abstractions.", install: "cargo add sentinels-sdk" },
  { name: "Python", description: "AI/ML integration, data analysis pipelines, and rapid prototyping.", install: "pip install sentinels-sdk" },
  { name: "Go", description: "Fleet management services, backend integrations, and high-concurrency workloads.", install: "go get github.com/sentinels-robotics/sdk-go" },
  { name: "TypeScript", description: "Dashboard development, web applications, and Node.js services.", install: "npm install @sentinels/sdk" },
];

const apiEndpoints = [
  { method: "POST", path: "/v1/robots/register", description: "Register a new robot with DID and keypair generation" },
  { method: "GET", path: "/v1/robots/:id", description: "Retrieve robot identity, status, and trust score" },
  { method: "POST", path: "/v1/verify/firmware", description: "Verify firmware hash against on-chain proof" },
  { method: "POST", path: "/v1/verify/telemetry", description: "Submit signed telemetry batch for verification" },
  { method: "GET", path: "/v1/fleet/stats", description: "Fleet-wide statistics and health metrics" },
  { method: "POST", path: "/v1/commands/send", description: "Send verified command to a robot" },
  { method: "GET", path: "/v1/audit/:robotId", description: "Retrieve immutable audit log for a robot" },
  { method: "POST", path: "/v1/solana/anchor", description: "Anchor a proof hash on Solana" },
];

const rustExample = `use sentinels_sdk::{Client, Robot, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new(Config {
        api_key: std::env::var("SENTINELS_API_KEY")?,
        endpoint: "https://api.sentinels.today".into(),
    });

    // Register robot with hardware attestation
    let robot = client.robots().register(Robot {
        name: "unit-0042".into(),
        model: "forklift-v2".into(),
        hardware_fingerprint: tpm::attest()?,
    }).await?;

    println!("DID: {}", robot.did);
    println!("Trust Score: {}/100", robot.trust_score);

    // Submit signed telemetry
    let telemetry = client.telemetry().submit(
        &robot.did,
        vec![
            Signal::new("POS_X", 24.551),
            Signal::new("POS_Y", -12.003),
            Signal::new("BATTERY", 87.2),
        ],
    ).await?;

    println!("Batch verified: {}", telemetry.verified);
    Ok(())
}`;

const tsExample = `import { Sentinels } from '@sentinels/sdk';

const sentinels = new Sentinels({
  apiKey: process.env.SENTINELS_API_KEY!,
});

// Register a new robot
const robot = await sentinels.robots.register({
  name: 'unit-0042',
  model: 'forklift-v2',
  serialNumber: 'SN-2026-0042',
});

// Verify firmware integrity
const proof = await sentinels.verify.firmware({
  robotId: robot.id,
  version: '2.4.1',
  hash: 'SHA-256:a4e8f...91cd',
});

console.log(proof.verified);    // true
console.log(proof.trustScore);  // 94
console.log(proof.solanaSlot);  // 258491032`;

const features = [
  { icon: Terminal, title: "CLI First", desc: "Full-featured CLI for automation, CI/CD integration, and scripting workflows" },
  { icon: Webhook, title: "Webhooks", desc: "Real-time event notifications for trust changes, alerts, and status updates" },
  { icon: Cpu, title: "Edge Runtime", desc: "Lightweight SDK for embedded devices â€” runs on Jetson, Pi, and industrial x86" },
  { icon: Activity, title: "Real-Time", desc: "WebSocket and gRPC streams for live telemetry and fleet monitoring" },
];

export default function DevelopersPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npm install @sentinels/sdk");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative grid-bg py-20 sm:py-28 lg:py-32 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
                Developers
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Built for Engineers
              </h1>
              <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
                First-class SDKs in Rust, Python, Go, and TypeScript. A powerful CLI. RESTful APIs. Integrate Sentinels into your robotics stack in minutes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-white h-11 px-6" asChild>
                  <Link href="/docs">
                    <BookOpen className="mr-1.5 h-4 w-4" />
                    Read Docs
                  </Link>
                </Button>
                <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5">
                  <code className="font-mono text-sm text-foreground">npm install @sentinels/sdk</code>
                  <button type="button" onClick={handleCopy} className="p-0 bg-transparent border-none cursor-pointer">
                    <Copy className={`h-4 w-4 ${copied ? "text-emerald-500" : "text-steel"} hover:text-foreground transition-colors`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SDKs */}
        <section className="py-20 sm:py-28 bg-surface grid-bg-dense border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">SDKs</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Native SDKs for every major robotics language. Type-safe, well-documented, and battle-tested.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sdks.map((sdk, i) => (
                <motion.div
                  key={sdk.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } } }}
                  className="group rounded-md border border-border bg-white p-6 transition-colors hover:border-sentinels/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="h-4 w-4 text-sentinels" strokeWidth={1.8} />
                    <span className="font-mono text-sm font-semibold text-foreground">{sdk.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{sdk.description}</p>
                  <code className="block font-mono text-[12px] text-sentinels bg-sentinels/5 px-3 py-1.5 rounded border border-sentinels/10">{sdk.install}</code>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-20 sm:py-28 bg-white border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Code Examples</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Get started in minutes with clear, production-ready examples.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rust Example */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
                <div className="rounded-lg border border-border bg-[#1A1A1D] overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#333] bg-[#111113]">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-gray-500 tracking-wider">main.rs â€” Rust SDK</span>
                  </div>
                  <div className="px-5 py-4 font-mono text-[12px] leading-6 text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-[400px]">
                    {rustExample}
                  </div>
                </div>
              </motion.div>

              {/* TypeScript Example */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
                <div className="rounded-lg border border-border bg-[#1A1A1D] overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#333] bg-[#111113]">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-gray-500 tracking-wider">index.ts â€” TypeScript SDK</span>
                  </div>
                  <div className="px-5 py-4 font-mono text-[12px] leading-6 text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-[400px]">
                    {tsExample}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="py-20 sm:py-28 bg-surface border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">API Reference</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                RESTful API with consistent patterns, comprehensive error handling, and rate limiting.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
              <div className="rounded-lg border border-border overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <th className="px-4 sm:px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Method</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Endpoint</th>
                        <th className="px-4 sm:px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel hidden sm:table-cell">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiEndpoints.map((endpoint) => (
                        <tr key={endpoint.path} className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
                          <td className="px-4 sm:px-6 py-3">
                            <span className={`font-mono text-[11px] font-semibold ${
                              endpoint.method === "POST" ? "text-emerald-600" : "text-blue-600"
                            }`}>
                              {endpoint.method}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 font-mono text-xs text-foreground">{endpoint.path}</td>
                          <td className="px-4 sm:px-6 py-3 text-sm text-muted-foreground hidden sm:table-cell">{endpoint.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Developer Features */}
        <section className="py-20 sm:py-28 bg-white border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } } }}
                    className="group rounded-md border border-border bg-surface p-5 transition-colors hover:border-sentinels/40 hover:shadow-sm"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{feature.title}</h3>
                    <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-surface border-t border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Start building today
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Free tier includes 10 robots. No credit card required.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-white h-11 px-6" asChild>
                  <Link href="/docs">
                    <BookOpen className="mr-1.5 h-4 w-4" />
                    Full Documentation
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="font-mono text-sm h-11 px-6" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
