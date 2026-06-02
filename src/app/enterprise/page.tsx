"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import {
  Shield,
  Building2,
  Lock,
  FileText,
  Server,
  Users,
  Truck,
  Factory,
  Plane,
  ArrowRight,
  ShieldCheck,
  Clock,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const enterpriseFeatures = [
  { icon: Shield, title: "SOC 2 Type II Certified", desc: "Full security, availability, and confidentiality controls with annual audits" },
  { icon: Server, title: "Dedicated Infrastructure", desc: "Isolated compute, storage, and networking for your fleet â€” no shared tenancy" },
  { icon: Clock, title: "99.99% SLA", desc: "Contractual uptime guarantee with financial credits for any downtime" },
  { icon: Lock, title: "On-Prem Deployment", desc: "Deploy Sentinels in your own data center or private cloud for full control" },
  { icon: FileText, title: "Compliance Exports", desc: "Automated audit report generation for SOC 2, ISO 27001, NIST, and IEC 62443" },
  { icon: Headphones, title: "Dedicated Support", desc: "Named support engineer with 15-minute response time for critical issues" },
  { icon: Users, title: "SSO & RBAC", desc: "SAML/OIDC single sign-on with granular role-based access control" },
  { icon: Building2, title: "Multi-Tenant Isolation", desc: "Dedicated key hierarchies and data isolation per business unit or customer" },
];

const industries = [
  {
    icon: Factory,
    name: "Smart Factories",
    description: "Industrial automation compliance, robot verification, and production line integrity monitoring.",
    stats: "500+ industrial robots managed",
  },
  {
    icon: Truck,
    name: "Logistics & Warehousing",
    description: "Warehouse robotics fleet management, autonomous forklift verification, and inventory robot audit trails.",
    stats: "1M+ daily telemetry events",
  },
  {
    icon: Plane,
    name: "Defense & Aerospace",
    description: "Mission-critical robot authentication, classified operation logging, and defense-grade compliance.",
    stats: "NIST 800-53 compliant",
  },
];

const process = [
  { step: "01", title: "Discovery Call", desc: "Understand your fleet size, compliance needs, and integration requirements" },
  { step: "02", title: "Technical Assessment", desc: "Architecture review, security audit, and deployment planning" },
  { step: "03", title: "Pilot Deployment", desc: "Deploy Sentinels with a subset of your fleet for validation" },
  { step: "04", title: "Full Rollout", desc: "Scale to your entire fleet with dedicated support and monitoring" },
];

export default function EnterprisePage() {
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
                Enterprise
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Trust at Scale
              </h1>
              <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
                Dedicated infrastructure, compliance certifications, and enterprise support for organizations deploying robotics at scale in regulated industries.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-white h-11 px-6">
                  Contact Sales
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="font-mono text-sm h-11 px-6" asChild>
                  <Link href="/security">Security Overview</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="py-20 sm:py-28 bg-surface grid-bg-dense border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Enterprise Features</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Everything your security and compliance teams need to approve deployment.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {enterpriseFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } } }}
                    className="group rounded-md border border-border bg-white p-5 transition-colors hover:border-sentinels/40 hover:shadow-sm"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-mono text-xs font-semibold tracking-wide text-foreground">{feature.title}</h3>
                    <p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-20 sm:py-28 bg-white border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Built for Regulated Industries</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Sentinels is deployed in environments where robot compromise has real-world consequences.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {industries.map((industry, i) => {
                const Icon = industry.icon;
                return (
                  <motion.div
                    key={industry.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                    className="rounded-lg border border-border bg-surface p-8"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sentinels/10 text-sentinels mb-5">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{industry.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{industry.description}</p>
                    <p className="mt-4 font-mono text-[11px] text-sentinels font-semibold uppercase tracking-wider">{industry.stats}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 sm:py-28 bg-surface border-t border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Deployment Process</h2>
              <p className="mt-4 text-base text-muted-foreground">From first call to full fleet deployment in weeks, not months.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {process.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                  className="rounded-md border border-border bg-white p-5"
                >
                  <span className="font-mono text-2xl font-bold text-sentinels/30">{step.step}</span>
                  <h3 className="mt-2 font-mono text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-white border-t border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <ShieldCheck className="h-12 w-12 text-sentinels mx-auto mb-6" strokeWidth={1.5} />
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Ready to deploy at scale?
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-lg mx-auto">
                Talk to our enterprise team about your fleet size, compliance requirements, and deployment timeline.
              </p>
              <div className="mt-8">
                <Button size="lg" className="font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-white h-12 px-8">
                  Schedule a Call
                  <ArrowRight className="ml-1.5 h-4 w-4" />
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
