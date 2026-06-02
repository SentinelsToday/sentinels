"use client";

export function TerminalCursor({ blink = true }: { blink?: boolean }) {
  return (
    <span
      className="inline-block w-[2px] h-[1em] bg-foreground/80 ml-[1px] align-middle rounded-[1px]"
      style={{
        boxShadow: "0 0 6px rgba(255,255,255,0.08)",
        animation: blink ? "sentinel-blink 1s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
      }}
    />
  );
}
