"use client";

import { useState, useEffect, type ReactNode } from "react";

export function TerminalWindow({
  title = "terminal",
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`rounded-lg border border-border bg-[#1A1A1D] overflow-hidden shadow-lg ${className}`}
      style={
        reduced
          ? {}
          : {
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
              transition: "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }
      }
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#333] bg-[#111113]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-[11px] text-gray-500 tracking-wide">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <div className="px-5 py-4 font-mono text-[13px] leading-7 whitespace-nowrap min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
