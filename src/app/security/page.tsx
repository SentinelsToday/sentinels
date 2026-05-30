"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/sentinel/header";
import { Footer } from "@/components/sentinel/footer";
import {
  Shield,
  Lock,
  Eye,
  Fingerprint,
  KeyRound,
  FileSignature,
  ShieldCheck,
  AlertTriangle,
  Server,
  Cpu,
  Link2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const securityPrinciples = [
  {
    icon: Lock,
    title: "Zero-Trust Architecture",
    description: "No implicit trust. Every robot, request, and action must authenticate and prove identity before access is granted.",
  },
  {
    icon: KeyRound,
    title: "End-to-End Encryption",
    description: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). Hardware-backed key management with HSM support.",
  },
  {
    icon: Fingerprint,
    title: "Hardware Attestation",
    description: "TPM 2.0, Secure Enclave, and Intel SGX support for hardware-rooted identity that cannot be spoofed or cloned.",
  },
  {
    icon: Eye,
    title: "Continuous Verification",
    description: "Runtime integrity checks verify firmware and software state continuously — not just at boot time.",
  },
  {
    icon: FileSignature,
    title: "Cryptographic Signing",
    description: "Ed25519 signatures on every telemetry point, command, and event. Tampered data is immediately detected.",
  },
  {
    icon: Shield,
    title: "Immutable Audit Trail",
    description: "Every security event is signed, timestamped, and anchored on-chain. Retroactive modification is impossible.",
  },
];

const threatModel = [
  { threat: "Firmware Tampering", mitigation: "SHA-256/Blake3 hash verification at boot and runtime, on-chain proof anchoring", severity: "CRITICAL" },
  { threat: "Identity Spoofing", mitigation: "Hardware-backed Ed25519 keys with DID registration on Solana", severity: "CRITICAL" },
  { threat: "Telemetry Injection", mitigation: "Cryptographic signatures on every data point with anomaly detection", severity: "HIGH" },
  { threat: "Command Replay", mitigation: "Nonce-based command verification with timestamp validation", severity: "HIGH" },
  { threat: "Key Compromise", mitigation: "Automatic key rotation, hardware enclave storage, revocation registry", severity: "HIGH" },
  { threat: "Network Interception", mitigation: "TLS 1.3 mutual authentication, certificate pinning", severity: "MEDIUM" },
];

const compliance = [
  { name: "SOC 2 Type II", status: "Certified", desc: "Security, availability, and confidentiality controls" },
  { name: "ISO 27001", status: "Certified", desc: "Information security management system" },
  { name: "NIST 800-53", status: "Compliant", desc: "Federal security and privacy controls" },
  { name: "IEC 62443", status: "Compliant", desc: "Industrial automation and control systems security" },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative grid-bg py-20 sm:py-28 lg:py-32 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 rounded border border-sentinel/20 bg-sentinel/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinel mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-sentinel" />
                Security
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Defense-Grade Security
              </h1>
              <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
                Zero-trust architecture, hardware-backed cryptography, and immutable audit trails. Built for regulated industries where robot compromise is not an option.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Security Principles */}
        <section className="py-20 sm:py-28 bg-surface grid-bg-dense border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Security Principles</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Every layer of Sentinel is designed with security as the primary constraint, not an afterthought.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {securityPrinciples.map((principle, i) => {
                const Icon = principle.icon;
                return (
                  <motion.div
                    key={principle.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } } }}
                    className="group rounded-md border border-border bg-white p-6 transition-colors hover:border-sentinel/40 hover:shadow-sm"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-steel transition-colors group-hover:bg-sentinel/10 group-hover:text-sentinel">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{principle.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Threat Model */}
        <section className="py-20 sm:py-28 bg-white border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Threat Model</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                We design against specific attack vectors targeting autonomous systems.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      <th className="px-4 sm:px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Threat</th>
                      <th className="px-4 sm:px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel hidden sm:table-cell">Mitigation</th>
                      <th className="px-4 sm:px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threatModel.map((item) => (
                      <tr key={item.threat} className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
                        <td className="px-4 sm:px-6 py-3.5 font-mono text-xs font-semibold text-foreground">{item.threat}</td>
                        <td className="px-4 sm:px-6 py-3.5 text-sm text-muted-foreground hidden sm:table-cell">{item.mitigation}</td>
                        <td className="px-4 sm:px-6 py-3.5">
                          <span className={`inline-flex font-mono text-[11px] font-semibold ${
                            item.severity === "CRITICAL" ? "text-red-600" :
                            item.severity === "HIGH" ? "text-amber-600" : "text-steel"
                          }`}>
                            {item.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Verification Pipeline */}
        <section className="py-20 sm:py-28 bg-surface border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Verification Pipeline</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Every robot boot triggers a multi-step verification sequence before any operation is permitted.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
              <div className="rounded-lg border border-border bg-[#1A1A1D] overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#333] bg-[#111113]">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-gray-500 tracking-wider">security-pipeline — boot verification</span>
                </div>
                <div className="px-5 py-4 font-mono text-[13px] leading-7">
                  <div><span className="text-gray-500">[00:00.001] </span><span className="text-blue-400">BOOT</span><span className="text-gray-400">  Hardware attestation initiated</span></div>
                  <div><span className="text-gray-500">[00:00.012] </span><span className="text-emerald-400">PASS</span><span className="text-gray-400">  TPM 2.0 identity confirmed — </span><span className="text-gray-200">fingerprint:0x8a3f...c2d1</span></div>
                  <div><span className="text-gray-500">[00:00.034] </span><span className="text-blue-400">HASH</span><span className="text-gray-400">  Firmware hash computed — </span><span className="text-[#E8553D]">SHA-256:a4e8f...91cd</span></div>
                  <div><span className="text-gray-500">[00:00.089] </span><span className="text-blue-400">CHAIN</span><span className="text-gray-400"> Verifying on-chain proof — Solana slot </span><span className="text-[#E8553D]">258491032</span></div>
                  <div><span className="text-gray-500">[00:00.142] </span><span className="text-emerald-400">PASS</span><span className="text-gray-400">  Firmware integrity verified ✓</span></div>
                  <div><span className="text-gray-500">[00:00.156] </span><span className="text-blue-400">AUTH</span><span className="text-gray-400">  DID authentication — </span><span className="text-gray-200">did:sentinel:0x7f3a...b2c1</span></div>
                  <div><span className="text-gray-500">[00:00.178] </span><span className="text-emerald-400">PASS</span><span className="text-gray-400">  Trust token issued — score </span><span className="text-emerald-400">98/100</span></div>
                  <div><span className="text-gray-500">[00:00.180] </span><span className="text-emerald-400">READY</span><span className="text-gray-400"> Robot unit-0042 operational</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-20 sm:py-28 bg-white border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Compliance & Certifications</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Enterprise-grade compliance for regulated industries including defense, industrial, and medical robotics.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {compliance.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } } }}
                  className="rounded-md border border-border bg-surface p-5 text-center"
                >
                  <ShieldCheck className="h-8 w-8 text-sentinel mx-auto mb-3" strokeWidth={1.5} />
                  <h3 className="font-mono text-sm font-semibold text-foreground">{cert.name}</h3>
                  <span className="inline-block mt-1 font-mono text-[11px] text-emerald-600 font-semibold">{cert.status}</span>
                  <p className="mt-2 text-[13px] text-muted-foreground">{cert.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-surface border-t border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Security is not optional
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Talk to our security team about your compliance requirements and threat model.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="font-mono text-sm bg-sentinel hover:bg-sentinel-muted text-white h-11 px-6" asChild>
                  <Link href="/enterprise">
                    Enterprise Security
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="font-mono text-sm h-11 px-6" asChild>
                  <Link href="/docs">Security Documentation</Link>
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
