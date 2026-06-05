import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const VALID_SLUG = /^[a-z0-9-]{1,50}$/;
const VALID_NAME = /^.{1,100}$/;

export async function GET() {
  const orgs = await db.organization.findMany();
  return NextResponse.json(orgs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug required' }, { status: 400 });
    }
    if (!VALID_NAME.test(name)) {
      return NextResponse.json({ error: 'name must be 1-100 characters' }, { status: 400 });
    }
    if (!VALID_SLUG.test(slug)) {
      return NextResponse.json({ error: 'slug must be 1-50 lowercase alphanumeric or hyphens' }, { status: 400 });
    }

    const org = await db.organization.create({ data: { name, slug, ownerId: "" } });
    return NextResponse.json(org, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
