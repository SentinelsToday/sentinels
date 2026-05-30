import { NextRequest, NextResponse } from 'next/server';
import { NotificationType } from '@/lib/notifications';

let preferences: { email: boolean; webhook: boolean; types: NotificationType[] } = {
  email: true,
  webhook: false,
  types: ['anomaly_detected', 'trust_drop'],
};

export async function GET() {
  return NextResponse.json(preferences);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (body.email !== undefined) preferences.email = body.email;
  if (body.webhook !== undefined) preferences.webhook = body.webhook;
  if (body.types !== undefined) preferences.types = body.types;
  return NextResponse.json(preferences);
}
