import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const memberCount = await db.orgMember.count({ where: { orgId } });
  return NextResponse.json({ ...org, memberCount });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.plan !== undefined) data.plan = body.plan;
  if (body.maxRobots !== undefined) data.maxRobots = body.maxRobots;

  const org = await db.organization.update({ where: { id: orgId }, data });
  return NextResponse.json(org);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (org.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await db.orgMember.deleteMany({ where: { orgId } });
  await db.organization.delete({ where: { id: orgId } });
  return NextResponse.json({ deleted: true });
}
