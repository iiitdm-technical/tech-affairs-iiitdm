import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Highlights } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { CACHE_TAGS, bust } from '@/lib/cache';

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== 'A')
    return { user: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { user, err: null };
}

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(Highlights).orderBy(asc(Highlights.sort_order), asc(Highlights.created_at));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { title, subtitle, image, link, tag, sort_order } = body;
  if (!title || !image) return NextResponse.json({ error: 'title and image are required' }, { status: 400 });
  const [row] = await db.insert(Highlights).values({
    title, subtitle: subtitle || '', image, link: link || '',
    tag: tag || '', sort_order: sort_order ?? 0, active: 'Y',
  }).returning();
  bust(CACHE_TAGS.highlights);
  return NextResponse.json({ success: true, highlight: row });
}

export async function PATCH(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const update: Record<string, unknown> = {};
  for (const key of ['title', 'subtitle', 'image', 'link', 'tag', 'sort_order', 'active'] as const) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  const [row] = await db.update(Highlights).set(update).where(eq(Highlights.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  bust(CACHE_TAGS.highlights);
  return NextResponse.json({ success: true, highlight: row });
}

export async function DELETE(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(Highlights).where(eq(Highlights.id, Number(id)));
  bust(CACHE_TAGS.highlights);
  return NextResponse.json({ success: true });
}
