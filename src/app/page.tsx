"use client";

import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import { HeroSection } from "@/components/sentinels/hero-section";
import { RobotIdentitySection } from "@/components/sentinels/robot-identity-section";
import { TelemetrySection } from "@/components/sentinels/telemetry-section";
import { FirmwareSection } from "@/components/sentinels/firmware-section";
import { FleetSection } from "@/components/sentinels/fleet-section";
import { EnterpriseSection } from "@/components/sentinels/enterprise-section";
import { DeveloperSection } from "@/components/sentinels/developer-section";
import { PricingSection } from "@/components/sentinels/pricing-section";
import { CtaSection } from "@/components/sentinels/cta-section";

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
