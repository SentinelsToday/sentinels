"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/robot/month",
    description: "For robotics startups getting started with trust infrastructure",
    features: [
      "Up to 10 robots",
      "Basic identity & DID registration",
      "Signed telemetry (1K events/day)",
      "Community support",
      "Dashboard access",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Fleet",
    price: "$12",
    period: "/robot/month",
    description: "For growing fleets that need full trust verification and compliance",
    features: [
      "Unlimited robots",
      "Full identity engine + key rotation",
      "Signed telemetry (unlimited)",
      "Firmware verification pipeline",
      "Fleet command dashboard",
      "On-chain proof anchoring",
      "Priority support",
    ],
    cta: "Request Access",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For defense, industrial, and regulated robotics operations",
    features: [
      "Everything in Fleet",
      "SOC 2 / ISO 27001 compliance",
      "Dedicated infrastructure",
      "Custom SLA (99.99%+)",
      "Hardware attestation (TPM/SGX)",
      "Dedicated support engineer",
      "On-prem deployment option",
      "Audit log exports",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28 lg:py-32 bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-2xl mx-auto text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Simple, Per-Robot Pricing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Scale your fleet without surprise costs. Pay only for the robots you manage.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className={`relative rounded-lg border p-6 sm:p-8 flex flex-col ${
                plan.highlighted
                  ? "border-sentinels/40 bg-sentinels/5 shadow-md"
                  : "border-border bg-white"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinels bg-white border border-sentinels/30 px-3 py-1 rounded-full">
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
                    <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-sentinels" : "text-emerald-500"}`} strokeWidth={2.5} />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-mono text-sm h-11 ${
                  plan.highlighted
                    ? "bg-sentinels hover:bg-sentinels-muted text-sentinels-foreground"
                    : "bg-foreground hover:bg-foreground/90 text-background"
                }`}
                asChild
              >
                <a href="#cta">{plan.cta}</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
