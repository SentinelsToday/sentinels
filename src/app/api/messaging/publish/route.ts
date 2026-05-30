import { NextResponse } from 'next/server';
import { getBroker } from '@/lib/messaging';

export async function POST(request: Request) {
  const { topic, payload } = await request.json();
  getBroker().publish(topic, payload);
  return NextResponse.json({ published: true, topic, timestamp: new Date().toISOString() });
}
