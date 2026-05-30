export const TOPICS = {
  TELEMETRY: 'sentinel/telemetry',
  COMMANDS: 'sentinel/commands',
  ALERTS: 'sentinel/alerts',
  FIRMWARE: 'sentinel/firmware',
  STATUS: 'sentinel/status',
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
  console.log(`[MQTT stub] Would connect to ${url}`);
  return mockBroker();
}

export function createNATSBroker(url: string): MessageBroker {
  console.log(`[NATS stub] Would connect to ${url}`);
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
