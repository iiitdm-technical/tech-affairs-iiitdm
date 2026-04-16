import { NextResponse } from 'next/server';
import { db } from '@/db';
import { TechAffairsTeam } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export const revalidate = 300;

const getActiveTeam = unstable_cache(
  async () => {
    return db
      .select()
      .from(TechAffairsTeam)
      .where(eq(TechAffairsTeam.active, 'Y'))
      .orderBy(asc(TechAffairsTeam.type), asc(TechAffairsTeam.sort_order));
  },
  ['api-team-active'],
  { revalidate, tags: [CACHE_TAGS.team] }
);

export async function GET() {
  const rows = await getActiveTeam();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1200',
    },
  });
}
