import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Achievements } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const revalidate = 120;

const getAchievements = unstable_cache(
  async () => {
    return db
      .select()
      .from(Achievements)
      .orderBy(desc(Achievements.year), desc(Achievements.created_at));
  },
  ['api-achievements-all'],
  { revalidate }
);

export async function GET() {
  const rows = await getAchievements();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
    },
  });
}
