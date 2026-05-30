import { useEffect, useCallback, useRef, useState } from "react";
import { insforge } from "@/lib/insforge";

type RealtimeEvent = {
  id: string;
  robotId: string;
  eventType: string;
  payload: string;
  verified: boolean;
  timestamp: string;
};

type FleetAlert = {
  robotId: string;
  name: string;
  trustScore: number;
  status: string;
};

export function useRealtimeTelemetry(robotId?: string) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!robotId) return;
    const channel = `telemetry:${robotId}`;

    insforge.realtime.connect().then(() => {
      setConnected(true);
      insforge.realtime.subscribe(channel);
    });

    const handler = (payload: RealtimeEvent) => {
      setEvents((prev) => [payload, ...prev].slice(0, 50));
    };

    insforge.realtime.on("new_telemetry", handler);

    return () => {
      insforge.realtime.off("new_telemetry", handler);
      insforge.realtime.unsubscribe(channel);
    };
  }, [robotId]);

  return { events, connected };
}

export function useFleetAlerts() {
  const [alerts, setAlerts] = useState<FleetAlert[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    insforge.realtime.connect().then(() => {
      setConnected(true);
      insforge.realtime.subscribe("fleet:alerts");
      insforge.realtime.subscribe("fleet:status");
    });

    const alertHandler = (payload: FleetAlert) => {
      setAlerts((prev) => [payload, ...prev].slice(0, 20));
    };

    insforge.realtime.on("trust_alert", alertHandler);

    return () => {
      insforge.realtime.off("trust_alert", alertHandler);
      insforge.realtime.unsubscribe("fleet:alerts");
      insforge.realtime.unsubscribe("fleet:status");
    };
  }, []);

  return { alerts, connected };
}
