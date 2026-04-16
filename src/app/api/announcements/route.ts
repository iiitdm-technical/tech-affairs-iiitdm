import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Announcements } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export const revalidate = 60;

const getActiveAnnouncements = unstable_cache(
  async () => {
    return db
      .select()
      .from(Announcements)
      .where(eq(Announcements.active, 'Y'))
      .orderBy(desc(Announcements.created_at));
  },
  ['api-announcements-active'],
  { revalidate, tags: [CACHE_TAGS.announcements] }
);

export async function GET() {
  const rows = await getActiveAnnouncements();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
