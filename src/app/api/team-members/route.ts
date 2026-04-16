import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { TeamMembers } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export const revalidate = 300;

const getAllActiveMembers = unstable_cache(
  async () => {
    return db
      .select()
      .from(TeamMembers)
      .where(eq(TeamMembers.active, 'Y'))
      .orderBy(asc(TeamMembers.team_slug), asc(TeamMembers.sub_role), asc(TeamMembers.sort_order));
  },
  ['api-team-members-all-active'],
  { revalidate, tags: [CACHE_TAGS.teamMembers] }
);

const getMembersBySlug = unstable_cache(
  async (slug: string) => {
    return db
      .select()
      .from(TeamMembers)
      .where(and(eq(TeamMembers.team_slug, slug), eq(TeamMembers.active, 'Y')))
      .orderBy(asc(TeamMembers.sub_role), asc(TeamMembers.sort_order));
  },
  ['api-team-members-by-slug'],
  { revalidate, tags: [CACHE_TAGS.teamMembers] }
);

export async function GET(request: NextRequest) {
  const slug = new URL(request.url).searchParams.get('slug');
  const rows = slug ? await getMembersBySlug(slug) : await getAllActiveMembers();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1200',
    },
  });
}
