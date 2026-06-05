"use client";

import { useState, useEffect, useRef } from "react";

export function TerminalCounter({
  target,
  suffix = "",
  speed = 30,
  className = "",
}: {
  target: number;
  suffix?: string;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (displayed >= target) return;

    const animate = () => {
      setDisplayed((prev) => {
        const step = Math.max(1, Math.floor(target / 20));
        const next = Math.min(prev + step, target);
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
  }, [target, speed, displayed]);

  return <span className={`tabular-nums ${className}`}>{displayed}{suffix}</span>;
}
