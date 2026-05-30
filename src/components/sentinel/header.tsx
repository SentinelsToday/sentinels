"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Menu,
  Terminal,
} from "lucide-react";

const navLinks = [
  { label: "Platform", href: "/platform" },
  { label: "Security", href: "/security" },
  { label: "Developers", href: "/developers" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Shield className="h-5 w-5 text-sentinel transition-transform group-hover:scale-110" strokeWidth={2.5} />
            <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
              SENTINEL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-sm text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/docs">
                <Terminal className="mr-1.5 h-3.5 w-3.5" />
                CLI
              </Link>
            </Button>
            <Button
              size="sm"
              className="font-mono text-sm bg-sentinel hover:bg-sentinel-muted text-sentinel-foreground"
              asChild
            >
              <Link href="/auth/signin">Request Access</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-background border-border">
                <nav className="flex flex-col gap-1 mt-8" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 px-4 flex flex-col gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-mono text-sm"
                      asChild
                    >
                      <Link href="/docs">
                        <Terminal className="mr-1.5 h-3.5 w-3.5" />
                        CLI
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="w-full font-mono text-sm bg-sentinel hover:bg-sentinel-muted text-sentinel-foreground"
                      asChild
                    >
                      <Link href="/auth/signin">Request Access</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
