"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function CtaSection() {
  return (
    <section id="cta" className="relative py-20 sm:py-28 lg:py-32 bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="relative rounded-xl border border-border bg-white p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
        >
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sentinels/10">
                <Shield className="h-7 w-7 text-sentinels" strokeWidth={2} />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Secure Your Robot Fleet
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join the next generation of trust infrastructure for autonomous machines. Get early access to Sentinels&apos;s cryptographic identity and fleet verification platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-sentinels-foreground h-12 px-8"
                asChild
              >
                <a href="/auth/signin">
                  Request Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-mono text-sm h-12 px-8 border-border hover:border-muted-foreground"
                asChild
              >
                <a href="#developers">
                  View Documentation
                </a>
              </Button>
            </div>

            <p className="mt-6 font-mono text-xs text-muted-foreground">
              No credit card required Â· Free tier for up to 10 robots Â· SOC 2 compliant
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
