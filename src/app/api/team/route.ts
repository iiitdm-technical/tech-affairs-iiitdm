import { NextResponse } from 'next/server';
import { db } from '@/db';
import { TechAffairsTeam } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

import { facultyHeads, teamData, socialMediaLinks, coreTeams } from '@/data/team';

export const revalidate = 300;

const staticTeamRows = [
  { id: 1, type: 'sac', name: teamData.secretary.name, position: teamData.secretary.position, image: teamData.secretary.image, email: teamData.secretary.email, linkedin: teamData.secretary.linkedin, url: '', path: '', sort_order: 1 },
  { id: 2, type: 'sac', name: teamData.jointSecretary.name, position: teamData.jointSecretary.position, image: teamData.jointSecretary.image, email: teamData.jointSecretary.email, linkedin: teamData.jointSecretary.linkedin, url: '', path: '', sort_order: 2 },
  ...facultyHeads.map((f, i) => ({ id: i + 3, type: 'faculty', name: f.name, position: f.role, image: f.image, email: '', linkedin: '', url: '', path: '', sort_order: i + 1 })),
  { id: 10, type: 'social', name: 'Instagram', position: '', image: '', email: '', linkedin: '', url: socialMediaLinks.instagram, path: '', sort_order: 1 },
  { id: 11, type: 'social', name: 'LinkedIn', position: '', image: '', email: '', linkedin: '', url: socialMediaLinks.linkedin, path: '', sort_order: 2 },
  { id: 12, type: 'social', name: 'YouTube', position: '', image: '', email: '', linkedin: '', url: socialMediaLinks.youtube, path: '', sort_order: 3 },
  ...coreTeams.map((c, i) => ({ id: i + 20, type: 'core_team', name: c.label, position: '', image: '', email: '', linkedin: '', url: '', path: c.path, sort_order: i + 1 })),
];

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
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(staticTeamRows);
    }
    const rows = await getActiveTeam();
    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1200',
      },
    });
  } catch {
    return NextResponse.json(staticTeamRows);
  }
}
