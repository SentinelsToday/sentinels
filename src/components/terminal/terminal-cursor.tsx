"use client";

export function TerminalCursor({ blink = true }: { blink?: boolean }) {
  return (
    <span
      className="inline-block w-[2px] self-center h-[1.1em] bg-gray-300 ml-[1px] rounded-[1px]"
      style={{
        boxShadow: "0 0 6px rgba(255,255,255,0.06)",
        animation: blink ? "sentinels-blink 1s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
      }}
    />
  );
}
