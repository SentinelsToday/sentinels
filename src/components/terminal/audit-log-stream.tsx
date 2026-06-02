"use client";

import { useState, useEffect } from "react";

export function AuditLogStream({ events }: { events: { time: string; tag: string; tagColor: string; message: React.ReactNode }[] }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= events.length) return;
    const delay = visible === 0 ? 500 : 400 + Math.random() * 400;
    const timer = setTimeout(() => setVisible((c) => c + 1), delay);
    return () => clearTimeout(timer);
  }, [visible, events.length]);

  return (
    <>
      {events.slice(0, visible).map((ev, i) => (
        <div
          key={i}
          className="flex"
          style={{
            opacity: 1,
            transform: "translateX(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <span className="text-gray-500 shrink-0">{ev.time} </span>
          <span className={ev.tagColor + " shrink-0 mr-1"}>{ev.tag}</span>
          <span className="text-gray-400">{ev.message}</span>
        </div>
      ))}
    </>
  );
}
