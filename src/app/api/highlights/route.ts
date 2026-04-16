import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Highlights } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export const revalidate = 120;

const getHighlights = unstable_cache(
  async () => {
    return db
      .select()
      .from(Highlights)
      .where(eq(Highlights.active, 'Y'))
      .orderBy(asc(Highlights.sort_order), asc(Highlights.created_at));
  },
  ['api-highlights-active'],
  { revalidate, tags: [CACHE_TAGS.highlights] }
);

export async function GET() {
  const rows = await getHighlights();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
    },
  });
}
