"use client";

import { useState, useEffect, useRef } from "react";

const PUNCTUATION = new Set([".", ",", "!", "?", ";", ":", "\n"]);

function nextSpeed(text: string, pos: number): number {
  const prev = text[pos - 1];
  if (prev && PUNCTUATION.has(prev)) {
    return 40 + Math.random() * 40;
  }
  if (prev === " " && text.length > 1) {
    if (Math.random() < 0.25) return 6 + Math.random() * 8;
  }
  if (Math.random() < 0.15) {
    return 6 + Math.random() * 8;
  }
  return 12 + Math.random() * 18;
}

export function TypewriterText({
  text,
  onComplete,
  startDelay = 0,
}: {
  text: string;
  onComplete?: () => void;
  startDelay?: number;
}) {
  const [displayed, setDisplayed] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (displayed >= text.length) {
      onCompleteRef.current?.();
      return;
    }
    const delay = displayed === 0 ? startDelay : nextSpeed(text, displayed);
    const timer = setTimeout(() => setDisplayed((c) => c + 1), delay);
    return () => clearTimeout(timer);
  }, [displayed, text, startDelay]);

  return <span>{text.slice(0, displayed)}</span>;
}
