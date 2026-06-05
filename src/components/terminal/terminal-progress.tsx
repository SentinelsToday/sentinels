"use client";

import { useState, useEffect, useRef } from "react";

export function TerminalProgress({
  value,
  max = 100,
  label,
  speed = 20,
  className = "",
}: {
  value: number;
  max?: number;
  label?: string;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const target = Math.min(value, max);
    if (displayed >= target) return;

    const animate = () => {
      setDisplayed((prev) => {
        const next = Math.min(prev + 1, target);
        if (next < target) {
          rafRef.current = requestAnimationFrame(animate);
        }
        return next;
      });
    };

    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, speed);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, max, speed, displayed]);

  const pct = Math.round((displayed / max) * 100);

  return (
    <span className={`inline-flex items-center gap-2 font-mono ${className}`}>
      {label && <span className="shrink-0">{label}</span>}
      <span className="tracking-wide">
        {"█".repeat(Math.floor(pct / 10))}
        {"░".repeat(10 - Math.floor(pct / 10))}
      </span>
      <span className="tabular-nums shrink-0">{displayed}/{max}</span>
    </span>
  );
}
