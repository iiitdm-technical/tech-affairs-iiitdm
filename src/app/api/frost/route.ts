// Public Frost contributions API
// GET  /api/frost?page_path=... — fetch approved contributions for a page
// POST /api/frost — submit a new contribution (requires login)

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { FrostContributions } from '@/db/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS, bust } from '@/lib/cache';

export const revalidate = 120;

const getApprovedByPath = unstable_cache(
  async (page_path: string) => {
    return db
      .select()
      .from(FrostContributions)
      .where(
        and(
          eq(FrostContributions.page_path, page_path),
          eq(FrostContributions.status, 'approved'),
          isNull(FrostContributions.deleted_at),
        )
      )
      .orderBy(desc(FrostContributions.created_at));
  },
  ['api-frost-by-path'],
  { revalidate, tags: [CACHE_TAGS.frost] }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page_path = searchParams.get('page_path');
  if (!page_path) return NextResponse.json({ error: 'page_path required' }, { status: 400 });

  const rows = await getApprovedByPath(page_path);
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
    },
  });
}

export async function POST(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user) {
    return NextResponse.json({ error: 'Login required to contribute' }, { status: 401 });
  }

  const body = await request.json();
  const { page_path, page_title, title, content } = body;

  if (!page_path || !page_title || !title || !content) {
    return NextResponse.json({ error: 'page_path, page_title, title, and content are required' }, { status: 400 });
  }
  if (content.trim().length < 10) {
    return NextResponse.json({ error: 'Content is too short' }, { status: 400 });
  }

  const [row] = await db.insert(FrostContributions).values({
    page_path,
    page_title,
    title,
    body: content,
    author_id: user.id,
    author_name: user.name,
    author_email: user.email,
    status: 'pending',
  }).returning();

  return NextResponse.json({ success: true, contribution: row });
}
