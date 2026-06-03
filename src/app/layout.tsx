import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentinels Robotics â€” Trust Infrastructure for Autonomous Machines",
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
  authors: [{ name: "Sentinels Robotics", url: "https://sentinels.today" }],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  metadataBase: new URL("https://sentinels.today"),
  openGraph: {
    title: "Sentinels Robotics — Trust Infrastructure for Autonomous Machines",
    description:
      "Cryptographic identity, secure telemetry, and verifiable fleet operations for robotics systems.",
    type: "website",
    url: "https://sentinels.today",
    siteName: "Sentinels Robotics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentinels Robotics",
    description:
      "Trust Infrastructure for Autonomous Machines",
    site: "@sentinelstoday",
    creator: "@sentinelstoday",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
