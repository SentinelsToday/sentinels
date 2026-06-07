"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { QueryProvider } from "@/components/providers/query-provider";
import { Bot, LayoutDashboard, ArrowLeft, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/robots", label: "Robots", icon: Bot },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <QueryProvider>
      <div className="flex h-screen overflow-hidden">
        <aside className="w-56 border-r border-neutral-200 flex flex-col bg-white">
          <div className="p-4 border-b border-neutral-200">
            <Link href="/" className="flex items-center gap-2 text-[#111113]">
              <Image src="/logo.jpg" alt="Sentinels" width={24} height={24} className="h-6 w-6 object-contain" />
              <span className="font-semibold text-sm font-mono">SENTINELS</span>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    active
                      ? "bg-neutral-100 text-[#111113] font-medium"
                      : "text-neutral-500 hover:text-[#111113] hover:bg-neutral-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-neutral-200">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-[#111113] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-neutral-50/50 p-6">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
