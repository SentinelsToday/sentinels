import { Shield } from "lucide-react";

const footerLinks = {
  Platform: ["Robot Identity", "Trust Verification", "Fleet Command", "Audit Layer", "Robot Wallets"],
  Developers: ["Documentation", "SDK Reference", "API Status", "Changelog", "GitHub"],
  Company: ["About", "Blog", "Careers", "Contact", "Press"],
  Legal: ["Privacy", "Terms", "Security", "Compliance", "DPA"],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Shield className="h-5 w-5 text-sentinel" strokeWidth={2.5} />
                <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
                  SENTINEL
                </span>
              </div>
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
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © 2025 Sentinel Robotics, Inc. All rights reserved.
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
