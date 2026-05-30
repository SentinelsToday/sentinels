import { NextRequest, NextResponse } from 'next/server';
import { getAggregates } from '@/lib/clickhouse';

export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams;
  const robotId = s.get('robotId') ?? '';
  const interval = (s.get('interval') ?? '1h') as '1m' | '5m' | '1h' | '1d';
  const aggregates = await getAggregates(robotId, interval);
  return NextResponse.json({ aggregates, interval });
}
