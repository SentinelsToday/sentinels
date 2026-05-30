"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/sentinel/header";
import { Footer } from "@/components/sentinel/footer";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/robot/month",
    description: "For robotics startups getting started with trust infrastructure.",
    features: [
      "Up to 10 robots",
      "Basic identity & DID registration",
      "Signed telemetry (1K events/day)",
      "Community support",
      "Dashboard access",
      "CLI tools",
    ],
    cta: "Start Free",
    ctaHref: "/auth/signin",
    highlighted: false,
  },
  {
    name: "Fleet",
    price: "$12",
    period: "/robot/month",
    description: "For growing fleets that need full trust verification and compliance.",
    features: [
      "Unlimited robots",
      "Full identity engine + key rotation",
      "Signed telemetry (unlimited)",
      "Firmware verification pipeline",
      "Fleet command dashboard",
      "On-chain proof anchoring (Solana)",
      "Webhooks & real-time events",
      "Priority support",
      "API rate limit: 10K req/min",
    ],
    cta: "Request Access",
    ctaHref: "/auth/signin",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For defense, industrial, and regulated robotics operations.",
    features: [
      "Everything in Fleet",
      "SOC 2 / ISO 27001 compliance",
      "Dedicated infrastructure",
      "Custom SLA (99.99%+)",
      "Hardware attestation (TPM/SGX)",
      "Dedicated support engineer",
      "On-prem deployment option",
      "Audit log exports",
      "Custom integrations",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    ctaHref: "/enterprise",
    highlighted: false,
  },
];

const faqs = [
  { q: "How is pricing calculated?", a: "You pay per active robot per month. A robot is active if it has sent at least one telemetry event or command in the billing period." },
  { q: "What counts as a robot?", a: "Any registered device with a DID — drones, forklifts, AGVs, industrial arms, or any autonomous system." },
  { q: "Can I switch plans?", a: "Yes. Upgrade or downgrade at any time. Changes take effect at the next billing cycle." },
  { q: "Is there a free trial for Fleet?", a: "Yes. 14-day free trial with full Fleet features. No credit card required." },
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

        {/* Pricing Cards */}
        <section className="py-16 sm:py-20 bg-surface border-t border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                  className={`relative rounded-lg border p-6 sm:p-8 flex flex-col ${
                    plan.highlighted
                      ? "border-sentinel/40 bg-white shadow-md"
                      : "border-border bg-white"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinel bg-white border border-sentinel/30 px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="mb-6">
                    <h3 className="font-mono text-sm font-semibold tracking-widest text-steel uppercase">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="font-mono text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-sentinel" : "text-emerald-500"}`} strokeWidth={2.5} />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full font-mono text-sm h-11 ${
                      plan.highlighted
                        ? "bg-sentinel hover:bg-sentinel-muted text-white"
                        : "bg-foreground hover:bg-foreground/90 text-background"
                    }`}
                    asChild
                  >
                    <Link href={plan.ctaHref}>{plan.cta}</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                        <th className="px-4 sm:px-6 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinel">Fleet</th>
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
                                <span className="text-muted-foreground">—</span>
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
                    <HelpCircle className="h-4 w-4 text-sentinel shrink-0 mt-0.5" strokeWidth={1.8} />
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
