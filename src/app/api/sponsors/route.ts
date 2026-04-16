import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Sponsors } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export const revalidate = 120;

const getSponsors = unstable_cache(
  async () => {
    return db
      .select()
      .from(Sponsors)
      .where(eq(Sponsors.active, 'Y'))
      .orderBy(asc(Sponsors.sort_order));
  },
  ['api-sponsors-active'],
  { revalidate, tags: [CACHE_TAGS.sponsors] }
);

export async function GET() {
  const rows = await getSponsors();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
    },
  });
}
