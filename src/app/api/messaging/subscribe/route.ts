import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/messaging';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || '';
  return NextResponse.json({ messages: getMessages(topic), topic });
}
