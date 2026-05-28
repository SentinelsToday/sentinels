"use client";

import { Header } from "@/components/sentinel/header";
import { Footer } from "@/components/sentinel/footer";
import { HeroSection } from "@/components/sentinel/hero-section";
import { RobotIdentitySection } from "@/components/sentinel/robot-identity-section";
import { TelemetrySection } from "@/components/sentinel/telemetry-section";
import { FirmwareSection } from "@/components/sentinel/firmware-section";
import { FleetSection } from "@/components/sentinel/fleet-section";
import { EnterpriseSection } from "@/components/sentinel/enterprise-section";
import { DeveloperSection } from "@/components/sentinel/developer-section";
import { PricingSection } from "@/components/sentinel/pricing-section";
import { CtaSection } from "@/components/sentinel/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        <HeroSection />
        <RobotIdentitySection />
        <TelemetrySection />
        <FirmwareSection />
        <FleetSection />
        <EnterpriseSection />
        <DeveloperSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
