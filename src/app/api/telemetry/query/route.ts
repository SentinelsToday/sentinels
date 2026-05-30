import { NextRequest, NextResponse } from 'next/server';
import { queryTelemetry } from '@/lib/clickhouse';

export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams;
  const events = await queryTelemetry({
    robotId: s.get('robotId') ?? undefined,
    eventType: s.get('eventType') ?? undefined,
    from: s.get('from') ?? undefined,
    to: s.get('to') ?? undefined,
    limit: s.has('limit') ? Number(s.get('limit')) : undefined,
  });
  return NextResponse.json({ events, total: events.length });
}
