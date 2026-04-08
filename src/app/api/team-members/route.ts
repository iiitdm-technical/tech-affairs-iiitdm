import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { TeamMembers } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const slug = new URL(request.url).searchParams.get('slug');
  const query = db
    .select()
    .from(TeamMembers)
    .where(
      slug
        ? and(eq(TeamMembers.team_slug, slug), eq(TeamMembers.active, 'Y'))
        : eq(TeamMembers.active, 'Y')
    )
    .orderBy(asc(TeamMembers.team_slug), asc(TeamMembers.sub_role), asc(TeamMembers.sort_order));

  const rows = await query;
  return NextResponse.json(rows);
}
