"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import { PricingSection } from "@/components/sentinels/pricing-section";
import { Check, HelpCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const faqs = [
  { q: "How is pricing calculated?", a: "You pay per active robot per month. A robot is active if it has sent at least one telemetry event or command in the billing period." },
  { q: "What counts as a robot?", a: "Any registered device with a DID â€” drones, forklifts, AGVs, industrial arms, or any autonomous system." },
  { q: "Can I switch plans?", a: "Yes. Upgrade or downgrade at any time. Changes take effect at the next billing cycle." },
  { q: "Is there a free trial for Fleet?", a: "Yes. 14-day free trial with full Fleet features. No card required." },
  { q: "How do payments work?", a: "Subscriptions settle on Solana via the native Subscriptions & Allowances program. You authorize a recurring spend in USDC or $SENT from your wallet â€” no card on file, no processor in the middle." },
  { q: "What about on-chain costs?", a: "Solana transaction fees are included in Fleet and Enterprise plans. Starter plan does not include on-chain anchoring." },
  { q: "Do you offer volume discounts?", a: "Yes. Enterprise plans include volume pricing for fleets over 1,000 robots. Contact sales for details." },
];

const comparison = [
  { feature: "Robot Registration", starter: true, fleet: true, enterprise: true },
  { feature: "DID Identity", starter: true, fleet: true, enterprise: true },
  { feature: "Signed Telemetry", starter: "1K/day", fleet: "Unlimited", enterprise: "Unlimited" },
  { feature: "Firmware Verification", starter: false, fleet: true, enterprise: true },
  { feature: "On-Chain Proofs", starter: false, fleet: true, enterprise: true },
  { feature: "Fleet Dashboard", starter: true, fleet: true, enterprise: true },
  { feature: "Key Rotation", starter: false, fleet: true, enterprise: true },
  { feature: "Hardware Attestation", starter: false, fleet: false, enterprise: true },
  { feature: "Webhooks", starter: false, fleet: true, enterprise: true },
  { feature: "Custom SLA", starter: false, fleet: false, enterprise: true },
  { feature: "On-Prem Deployment", starter: false, fleet: false, enterprise: true },
  { feature: "Compliance Exports", starter: false, fleet: false, enterprise: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative grid-bg py-20 sm:py-28 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Simple, Per-Robot Pricing
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
                Scale your fleet without surprise costs. Pay only for the robots you manage.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards (shared with landing) */}
        <PricingSection />

        {/* Feature Comparison */}
        <section className="py-16 sm:py-20 bg-white border-t border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Feature Comparison</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        <th className="px-4 sm:px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Feature</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Starter</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinels">Fleet</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((row) => (
                        <tr key={row.feature} className="border-b border-border/50 last:border-0">
                          <td className="px-4 sm:px-6 py-3 text-sm text-foreground">{row.feature}</td>
                          {[row.starter, row.fleet, row.enterprise].map((val, i) => (
                            <td key={i} className="px-4 sm:px-6 py-3 text-center">
                              {val === true ? (
                                <Check className="h-4 w-4 text-emerald-500 mx-auto" strokeWidth={2.5} />
                              ) : val === false ? (
                                <span className="text-muted-foreground">â€”</span>
                              ) : (
                                <span className="font-mono text-xs text-foreground">{val}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 bg-surface border-t border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
            </motion.div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } } }}
                  className="rounded-md border border-border bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-4 w-4 text-sentinels shrink-0 mt-0.5" strokeWidth={1.8} />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{faq.q}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
