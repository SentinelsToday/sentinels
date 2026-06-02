"use client";

import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Lock,
  Eye,
  Scale,
  Building2,
  Truck,
  Plane,
  Factory,
  Cross,
} from "lucide-react";
import { TerminalWindow, AuditLogStream } from "@/components/terminal";

const complianceFeatures = [
  { icon: Shield, title: "End-to-End Encryption", desc: "All data encrypted in transit and at rest with hardware-backed key management" },
  { icon: FileText, title: "Immutable Audit Logs", desc: "Every event signed, timestamped, and anchored on-chain for compliance export" },
  { icon: Lock, title: "Zero-Trust Architecture", desc: "No implicit trust â€” every robot, request, and action must authenticate" },
  { icon: Eye, title: "Firmware Integrity", desc: "Boot-time and runtime verification ensures no compromised code executes" },
  { icon: Scale, title: "Regulatory Compliance", desc: "SOC 2, ISO 27001, and defense-grade compliance frameworks built-in" },
  { icon: Building2, title: "Multi-Tenant Isolation", desc: "Enterprise-grade tenant isolation with dedicated key hierarchies" },
];

const industries = [
  { icon: Factory, name: "Smart Factories", desc: "Industrial automation compliance and robot verification" },
  { icon: Truck, name: "Logistics", desc: "Warehouse robotics fleet management and audit trails" },
  { icon: Plane, name: "Defense", desc: "Mission-critical robot authentication and compliance" },
  { icon: Cross, name: "Medical Robotics", desc: "Surgical and laboratory robot verification and logging" },
];

const auditEvents = [
  { time: "2025-01-15T08:23:41Z ", tag: "AUDIT", tagColor: "text-emerald-400", message: <> Robot <span className="text-gray-200">unit-0042</span> firmware verified â€” hash <span className="text-[#E8553D]">0xa4e8f...91cd</span></> },
  { time: "2025-01-15T08:23:42Z ", tag: "AUTH", tagColor: "text-blue-400", message: <>  DID <span className="text-gray-200">did:sentinels:0x7f3a</span> trust score updated <span className="text-emerald-400">94â†’98</span></> },
  { time: "2025-01-15T08:23:43Z ", tag: "WARN", tagColor: "text-amber-400", message: <> Robot <span className="text-gray-200">unit-0307</span> battery below threshold â€” <span className="text-amber-400">12%</span></> },
  { time: "2025-01-15T08:23:44Z ", tag: "SIGN", tagColor: "text-emerald-400", message: <> Telemetry batch <span className="text-gray-200">#4891</span> anchored on Solana slot <span className="text-[#E8553D]">258491032</span></> },
  { time: "2025-01-15T08:23:45Z ", tag: "AUDIT", tagColor: "text-emerald-400", message: <> Mission <span className="text-gray-200">pick-warehouse-a</span> completed by <span className="text-gray-200">unit-0042</span></> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function EnterpriseSection() {
  return (
    <section id="security" className="relative py-20 sm:py-28 lg:py-32 bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
            Enterprise Security
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3">
            Compliance-Grade Trust
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Enterprise security and compliance infrastructure designed for regulated industries. Every action is verified, every event is auditable, every robot is accountable.
          </p>
        </motion.div>

        {/* Compliance features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {complianceFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group rounded-md border border-border bg-surface p-6 transition-colors duration-200 hover:border-sentinels/40 hover:shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Audit trail visual */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-16 sm:mb-20"
        >
          <TerminalWindow title="audit-log â€” immutable events">
            <AuditLogStream events={auditEvents} />
          </TerminalWindow>
        </motion.div>

        {/* Industries */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <div className="mb-8 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">Built For</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((industry, i) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="group flex flex-col items-center text-center rounded-md border border-border bg-surface p-6 transition-colors duration-200 hover:border-sentinels/40 hover:shadow-sm"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{industry.name}</h3>
                  <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{industry.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
