import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Orgs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { asc } from 'drizzle-orm';

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== 'A') return { user: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { user, err: null };
}

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(Orgs).orderBy(asc(Orgs.category), asc(Orgs.sort_order));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { name, image, link, category, sort_order } = await request.json();
  if (!name || !link || !category) return NextResponse.json({ error: 'name, link, category required' }, { status: 400 });
  const [row] = await db.insert(Orgs).values({ name, image: image || '', link, category, sort_order: sort_order ?? 0 }).returning();
  return NextResponse.json({ success: true, org: row });
}

export async function PATCH(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const update: Record<string, unknown> = {};
  for (const key of ['name', 'image', 'link', 'category', 'sort_order'] as const) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  const [row] = await db.update(Orgs).set(update).where(eq(Orgs.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, org: row });
}

export async function DELETE(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(Orgs).where(eq(Orgs.id, Number(id)));
  return NextResponse.json({ success: true });
}
