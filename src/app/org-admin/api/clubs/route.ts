import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Clubs, Orgs } from '@/db/schema';
import { inArray, isNotNull, eq, and } from 'drizzle-orm';

function isOrgAdmin(user: { role: string; orgSlugs: string[] }) {
  return user.role === 'A' || (user.role === 'O' && user.orgSlugs.length > 0);
}

export async function GET(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Super-admin sees all clubs
  if (user.role === 'A') {
    const rows = await db
      .select({ club_id: Clubs.club_id, name: Clubs.name })
      .from(Clubs);
    return NextResponse.json(rows);
  }

  // Org-admin: resolve club IDs via two methods and union them:
  // 1. Direct match: clubs.org_slug IN user.orgSlugs
  // 2. Via orgs table: orgs.link matches slug patterns → club_ref_id
  const [directClubs, orgRefClubs] = await Promise.all([
    // Method 1: direct org_slug match on clubs table
    db.select({ club_id: Clubs.club_id, name: Clubs.name })
      .from(Clubs)
      .where(inArray(Clubs.org_slug, user.orgSlugs)),

    // Method 2: find club_ref_id from orgs table where the org link matches the slug
    db.select({ club_id: Orgs.club_ref_id, name: Clubs.name })
      .from(Orgs)
      .innerJoin(Clubs, eq(Clubs.club_id, Orgs.club_ref_id))
      .where(and(eq(Orgs.authorized_email, user.email), isNotNull(Orgs.club_ref_id))),
  ]);

  // Merge and deduplicate by club_id
  const seen = new Set<number>();
  const result: { club_id: number; name: string }[] = [];
  for (const c of [...directClubs, ...orgRefClubs]) {
    if (c.club_id && !seen.has(c.club_id)) {
      seen.add(c.club_id);
      result.push({ club_id: c.club_id, name: c.name });
    }
  }

  return NextResponse.json(result);
}
