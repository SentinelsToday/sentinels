import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const memberships = await db.orgMember.findMany({ where: { userId } });
  const orgs: any[] = [];
  for (const m of memberships) {
    const org = await db.organization.findUnique({ where: { id: (m as any).orgId } });
    if (org) orgs.push(org);
  }
  return NextResponse.json(orgs);
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, slug } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 });

  const org = await db.organization.create({ data: { name, slug, ownerId: userId } });
  await db.orgMember.create({ data: { orgId: org.id, userId, role: 'owner' } });
  return NextResponse.json(org, { status: 201 });
}
