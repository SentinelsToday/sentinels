import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentinel Robotics — Trust Infrastructure for Autonomous Machines",
  description:
    "Cryptographic identity, secure telemetry, and verifiable fleet operations for robotics systems. OAuth for robots. IAM for autonomous systems.",
  keywords: [
    "robotics",
    "autonomous systems",
    "robot identity",
    "fleet management",
    "telemetry",
    "firmware verification",
    "blockchain",
    "Solana",
    "trust infrastructure",
    "compliance",
  ],
  authors: [{ name: "Sentinel Robotics" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sentinel Robotics — Trust Infrastructure for Autonomous Machines",
    description:
      "Cryptographic identity, secure telemetry, and verifiable fleet operations for robotics systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentinel Robotics",
    description:
      "Trust Infrastructure for Autonomous Machines",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
