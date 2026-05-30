import { NextRequest, NextResponse } from 'next/server';
import { sendNotification, formatNotification, NotificationType } from '@/lib/notifications';

type StoredNotification = { type: NotificationType; robotId: string; data: Record<string, any>; subject: string; body: string; createdAt: string };

const notifications: StoredNotification[] = [];

export async function GET() {
  return NextResponse.json({ notifications });
}

export async function POST(req: NextRequest) {
  const { type, robotId, data } = await req.json();
  const { subject, body } = formatNotification(type, data ?? {});
  sendNotification(type, { ...data, robotId });
  const entry: StoredNotification = { type, robotId, data: data ?? {}, subject, body, createdAt: new Date().toISOString() };
  notifications.unshift(entry);
  if (notifications.length > 100) notifications.length = 100;
  return NextResponse.json({ notifications });
}
