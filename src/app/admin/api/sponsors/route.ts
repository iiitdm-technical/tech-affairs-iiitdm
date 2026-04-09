import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Sponsors } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== 'A')
    return { user: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { user, err: null };
}

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(Sponsors).orderBy(asc(Sponsors.sort_order));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { name, logo, website, tier, year, sort_order } = body;
  if (!name || !logo) return NextResponse.json({ error: 'name and logo are required' }, { status: 400 });
  const [row] = await db.insert(Sponsors).values({
    name, logo, website: website || '', tier: tier || 'general',
    year: year || '', sort_order: sort_order ?? 0, active: 'Y',
  }).returning();
  return NextResponse.json({ success: true, sponsor: row });
}

export async function PATCH(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const update: Record<string, unknown> = {};
  for (const key of ['name', 'logo', 'website', 'tier', 'year', 'sort_order', 'active'] as const) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  const [row] = await db.update(Sponsors).set(update).where(eq(Sponsors.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, sponsor: row });
}

export async function DELETE(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(Sponsors).where(eq(Sponsors.id, Number(id)));
  return NextResponse.json({ success: true });
}
