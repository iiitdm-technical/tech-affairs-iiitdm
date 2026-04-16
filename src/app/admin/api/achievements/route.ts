import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Achievements } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CACHE_TAGS, bust } from '@/lib/cache';

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== 'A') return { user: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { user, err: null };
}

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(Achievements).orderBy(Achievements.year);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { org_slug, title, description, year, proof_url, logo, image } = await request.json();
  if (!org_slug || !title || !description || !year) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const [row] = await db
    .insert(Achievements)
    .values({ org_slug, title, description, year, proof_url: proof_url || '', logo: logo || '', image: image || '' })
    .returning();
  bust(CACHE_TAGS.achievements);
  return NextResponse.json({ success: true, achievement: row });
}

export async function PATCH(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const updateData: Record<string, unknown> = {};
  for (const key of ['org_slug', 'title', 'description', 'year', 'proof_url', 'logo', 'image'] as const) {
    if (fields[key] !== undefined) updateData[key] = fields[key];
  }

  const [row] = await db.update(Achievements).set(updateData).where(eq(Achievements.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  bust(CACHE_TAGS.achievements);
  return NextResponse.json({ success: true, achievement: row });
}

export async function DELETE(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await db.delete(Achievements).where(eq(Achievements.id, Number(id)));
  bust(CACHE_TAGS.achievements);
  return NextResponse.json({ success: true });
}
