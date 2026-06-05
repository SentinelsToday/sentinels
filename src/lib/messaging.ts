export const TOPICS = {
  TELEMETRY: 'sentinels/telemetry',
  COMMANDS: 'sentinels/commands',
  ALERTS: 'sentinels/alerts',
  FIRMWARE: 'sentinels/firmware',
  STATUS: 'sentinels/status',
} as const;

export interface Message {
  topic: string;
  payload: unknown;
  timestamp: string;
}

export interface MessageBroker {
  publish(topic: string, payload: unknown): void;
  subscribe(topic: string, handler: (msg: Message) => void): void;
  disconnect(): void;
}

const MQTT_ENABLED = !!process.env.MQTT_BROKER_URL;
const NATS_ENABLED = !!process.env.NATS_SERVER_URL;

const messageStore: Message[] = [];
const subscribers = new Map<string, ((msg: Message) => void)[]>();

function createMessage(topic: string, payload: unknown): Message {
  return { topic, payload, timestamp: new Date().toISOString() };
}

function mockBroker(): MessageBroker {
  return {
    publish(topic, payload) {
      const msg = createMessage(topic, payload);
      messageStore.push(msg);
      subscribers.get(topic)?.forEach((h) => h(msg));
    },
    subscribe(topic, handler) {
      subscribers.set(topic, [...(subscribers.get(topic) || []), handler]);
    },
    disconnect() {},
  };
}

export function createMQTTBroker(url: string): MessageBroker {
  if (!MQTT_ENABLED) {
    console.warn(`[warn] MQTT not configured - set MQTT_BROKER_URL. Using in-memory fallback.`);
  }
  return mockBroker();
}

export function createNATSBroker(url: string): MessageBroker {
  if (!NATS_ENABLED) {
    console.warn(`[warn] NATS not configured - set NATS_SERVER_URL. Using in-memory fallback.`);
  }
  return mockBroker();
}

let broker: MessageBroker | null = null;

export function getBroker(): MessageBroker {
  if (!broker) broker = mockBroker();
  return broker;
}

export function getMessages(topic?: string): Message[] {
  return topic ? messageStore.filter((m) => m.topic === topic) : messageStore;
}
