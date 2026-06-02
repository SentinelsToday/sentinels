"use client";

import { useState, useCallback, useEffect } from "react";
import { TypewriterText } from "./typewriter-text";
import { TerminalCursor } from "./terminal-cursor";

export type TerminalLineDef = {
  prefix?: string;
  text: string;
  color?: string;
  delay?: number;
  type?: "command" | "output" | "success" | "error" | "warning" | "info";
};

const colorMap: Record<string, string> = {
  command: "text-gray-200",
  output: "text-gray-400",
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-300",
  info: "text-blue-300",
};

const prefixMap: Record<string, string> = {
  command: "$ ",
  success: "✓ ",
  error: "✗ ",
  warning: "! ",
  info: "→ ",
  output: "→ ",
};

function getColor(type?: string, color?: string) {
  if (color) return color;
  if (type && colorMap[type]) return colorMap[type];
  return "text-gray-400";
}

function getPrefix(type?: string, prefix?: string) {
  if (prefix !== undefined) return prefix;
  if (type && prefixMap[type]) return prefixMap[type];
  return "→ ";
}

export function TerminalLine({
  line,
  index,
  isActive,
  isComplete,
  showCursor,
}: {
  line: TerminalLineDef;
  index: number;
  isActive: boolean;
  isComplete: boolean;
  showCursor: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const prefix = getPrefix(line.type, line.prefix);
  const color = getColor(line.type, line.color);

  return (
    <div
      className={`flex ${color} ${mounted ? "" : "opacity-0"}`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-8px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <span className="select-none shrink-0 text-gray-500 mr-1">{prefix}</span>
      {isComplete ? (
        <span className="whitespace-pre-wrap break-all">{line.text}</span>
      ) : (
        <TypewriterText text={line.text} startDelay={line.delay ?? 0} />
      )}
      {isActive && <TerminalCursor blink />}
    </div>
  );
}

export type SequenceStep = TerminalLineDef & { gap?: number };

export function TerminalSequence({ steps }: { steps: SequenceStep[] }) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const completeLine = useCallback((i: number) => {
    const gap = steps[i]?.gap ?? 25;
    setTimeout(() => setCompleted((prev) => new Set(prev).add(i)), gap);
  }, [steps]);

  useEffect(() => {
    if (completed.size === 0 && steps.length > 0) {
      const firstDelay = steps[0].delay ?? 300;
      if (firstDelay > 0) {
        const timer = setTimeout(() => setCompleted(new Set()), 10);
        return () => clearTimeout(timer);
      }
    }
  }, [completed.size, steps]);

  return (
    <div className="relative">
      {steps.map((step, i) => {
        const isActive = i === completed.size && completed.size < steps.length;
        const isComplete = i <= completed.size - 1;
        if (!isActive && !isComplete) return null;

        return (
          <TerminalLine
            key={i}
            line={step}
            index={i}
            isActive={isActive}
            isComplete={isComplete}
            showCursor={true}
          />
        );
      })}
      {completed.size > 0 && completed.size < steps.length && (
        <div className="h-[14px]" />
      )}
    </div>
  );
}
