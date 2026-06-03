import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Platform: [
    { label: "Robot Identity", href: "/platform#identity" },
    { label: "Trust Verification", href: "/platform#trust" },
    { label: "Fleet Command", href: "/platform#fleet" },
    { label: "Audit Layer", href: "/platform#audit" },
    { label: "Robot Wallets", href: "/platform#wallet" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "SDK Reference", href: "/developers" },
    { label: "API Status", href: "/docs" },
    { label: "Changelog", href: "/blog" },
    { label: "GitHub", href: "https://github.com/SentinelsToday" },
    { label: "X / Twitter", href: "https://x.com/sentinelstoday" },
  ],
  Company: [
    { label: "About", href: "/platform" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/enterprise" },
    { label: "Contact", href: "/enterprise" },
    { label: "Enterprise", href: "/enterprise" },
  ],
  Legal: [
    { label: "Privacy", href: "/security" },
    { label: "Terms", href: "/security" },
    { label: "Security", href: "/security" },
    { label: "Compliance", href: "/enterprise" },
    { label: "DPA", href: "/enterprise" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <Image src="/logo.jpg" alt="Sentinels" width={24} height={24} className="h-6 w-6 object-contain" />
                <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
                  SENTINELS
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trust infrastructure for autonomous machines.
              </p>
              <div className="mt-4 font-mono text-xs text-steel">
                v0.1.0-alpha
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">
                  {category}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            Â© 2026 Sentinels Robotics, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
