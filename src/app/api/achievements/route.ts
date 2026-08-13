import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Achievements } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';
import { achievements as rawStaticAchievements } from '@/data/achievements';

export const revalidate = 120;

const CLUB_TO_ORG_SLUG: Record<string, string> = {
  'AUV Society': 'teams/nira',
  'Mars Club': 'teams/shunya',
  'TAD': 'teams/tad',
  'SAE Collegiate Club': 'teams/revolt',
  'IEEE Student Branch': 'societies/ieee',
  'Team Astra': 'teams/astra',
  'E-Cell': 'clubs/ecell',
};

const staticAchievements = rawStaticAchievements.map((a, index) => {
  const orgSlug = CLUB_TO_ORG_SLUG[a.club] ?? a.club.toLowerCase().replace(/\s+/g, '-');
  return {
    id: a.id || index + 1,
    org_slug: orgSlug,
    title: a.title,
    description: a.description,
    year: a.year,
    logo: a.logo,
    image: (a as { image?: string }).image || '',
    org_name: a.club,
  };
});

const getAchievements = unstable_cache(
  async () => {
    return db
      .select()
      .from(Achievements)
      .orderBy(desc(Achievements.year), desc(Achievements.created_at));
  },
  ['api-achievements-all'],
  { revalidate, tags: [CACHE_TAGS.achievements] }
);

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(staticAchievements);
    }
    const rows = await getAchievements();
    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json(staticAchievements);
  }
}
