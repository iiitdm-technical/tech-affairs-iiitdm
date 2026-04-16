import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Achievements } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { CACHE_TAGS, bust } from '@/lib/cache';

function isOrgAdmin(user: { role: string; orgSlugs: string[] }) {
  return user.role === 'A' || (user.role === 'O' && user.orgSlugs.length > 0);
}

export async function GET(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows =
    user.role === 'A'
      ? await db.select().from(Achievements).orderBy(Achievements.year)
      : await db
          .select()
          .from(Achievements)
          .where(inArray(Achievements.org_slug, user.orgSlugs))
          .orderBy(Achievements.year);

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { org_slug, title, description, year, proof_url, logo } = body;

  if (!org_slug || !title || !description || !year) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Org-admins can only add achievements for their own orgs
  if (user.role === 'O' && !user.orgSlugs.includes(org_slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [row] = await db
    .insert(Achievements)
    .values({ org_slug, title, description, year, proof_url: proof_url || '', logo: logo || '' })
    .returning();

  bust(CACHE_TAGS.achievements);
  return NextResponse.json({ success: true, achievement: row });
}

export async function PATCH(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, org_slug, title, description, year, proof_url, logo } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const [existing] = await db.select().from(Achievements).where(eq(Achievements.id, Number(id)));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role === 'O' && !user.orgSlugs.includes(existing.org_slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updateData: Record<string, unknown> = {};
  if (org_slug !== undefined) updateData.org_slug = org_slug;
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (year !== undefined) updateData.year = year;
  if (proof_url !== undefined) updateData.proof_url = proof_url;
  if (logo !== undefined) updateData.logo = logo;

  const [row] = await db.update(Achievements).set(updateData).where(eq(Achievements.id, Number(id))).returning();
  bust(CACHE_TAGS.achievements);
  return NextResponse.json({ success: true, achievement: row });
}

export async function DELETE(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const [existing] = await db.select().from(Achievements).where(eq(Achievements.id, Number(id)));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role === 'O' && !user.orgSlugs.includes(existing.org_slug)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await db.delete(Achievements).where(eq(Achievements.id, Number(id)));
  bust(CACHE_TAGS.achievements);
  return NextResponse.json({ success: true });
}
