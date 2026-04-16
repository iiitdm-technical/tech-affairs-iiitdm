import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Announcements } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { CACHE_TAGS, bust } from '@/lib/cache';

function unauth() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
function forbidden() { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }

export async function GET(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user) return unauth();
  if (user.role !== 'O' && user.role !== 'A') return forbidden();

  const slugs = user.role === 'A'
    ? undefined
    : user.orgSlugs;

  const rows = slugs
    ? await db.select().from(Announcements).where(inArray(Announcements.org_slug, slugs))
    : await db.select().from(Announcements);

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user) return unauth();
  if (user.role !== 'O' && user.role !== 'A') return forbidden();

  const { org_slug, title, body, link, media_url } = await request.json();
  if (!org_slug || !title || !body) return NextResponse.json({ error: 'org_slug, title and body required' }, { status: 400 });
  if (user.role === 'O' && !user.orgSlugs.includes(org_slug)) return forbidden();

  const [row] = await db.insert(Announcements).values({ org_slug, title, body, link: link ?? '', media_url: media_url ?? '', active: 'Y' }).returning();
  bust(CACHE_TAGS.announcements);
  return NextResponse.json(row);
}

export async function PATCH(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user) return unauth();
  if (user.role !== 'O' && user.role !== 'A') return forbidden();

  const { id, title, body, link, media_url, active } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const [existing] = await db.select().from(Announcements).where(eq(Announcements.id, id));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (user.role === 'O' && !user.orgSlugs.includes(existing.org_slug)) return forbidden();

  const update: Record<string, unknown> = {};
  if (title !== undefined) update.title = title;
  if (body !== undefined) update.body = body;
  if (link !== undefined) update.link = link;
  if (media_url !== undefined) update.media_url = media_url;
  if (active !== undefined) update.active = active;

  const [row] = await db.update(Announcements).set(update).where(eq(Announcements.id, id)).returning();
  bust(CACHE_TAGS.announcements);
  return NextResponse.json(row);
}

export async function DELETE(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user) return unauth();
  if (user.role !== 'O' && user.role !== 'A') return forbidden();

  const id = parseInt(new URL(request.url).searchParams.get('id') ?? '');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const [existing] = await db.select().from(Announcements).where(eq(Announcements.id, id));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (user.role === 'O' && !user.orgSlugs.includes(existing.org_slug)) return forbidden();

  await db.delete(Announcements).where(eq(Announcements.id, id));
  bust(CACHE_TAGS.announcements);
  return NextResponse.json({ success: true });
}
