import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Events, Clubs, Orgs } from '@/db/schema';
import { eq, inArray, isNotNull, and } from 'drizzle-orm';
import { CACHE_TAGS, bust } from '@/lib/cache';

// Helper: resolve club_ids for an org-admin via two methods:
// 1. clubs.org_slug matches their orgSlugs
// 2. orgs.authorized_email matches their email → club_ref_id
async function getAllowedClubIds(orgSlugs: string[], email: string): Promise<number[]> {
  if (orgSlugs.length === 0 && !email) return [];

  const [direct, viaOrgs] = await Promise.all([
    orgSlugs.length > 0
      ? db.select({ club_id: Clubs.club_id }).from(Clubs).where(inArray(Clubs.org_slug, orgSlugs))
      : [],
    email
      ? db.select({ club_id: Orgs.club_ref_id })
          .from(Orgs)
          .where(and(eq(Orgs.authorized_email, email), isNotNull(Orgs.club_ref_id)))
      : [],
  ]);

  const ids = new Set<number>();
  for (const r of [...direct, ...viaOrgs]) {
    if (r.club_id) ids.add(r.club_id);
  }
  return [...ids];
}

function isOrgAdmin(user: { role: string; orgSlugs: string[] }) {
  return user.role === 'A' || (user.role === 'O' && user.orgSlugs.length > 0);
}

export async function GET(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Super-admin sees all; org-admin sees their clubs only
  const events =
    user.role === 'A'
      ? await db
          .select({
            event_id: Events.event_id,
            club_id: Events.club_id,
            name: Events.name,
            description: Events.description,
            start_time: Events.start_time,
            end_time: Events.end_time,
            location: Events.location,
            link: Events.link,
            requirements: Events.requirements,
            imageUrl: Events.imageUrl,
            club_name: Clubs.name,
          })
          .from(Events)
          .leftJoin(Clubs, eq(Events.club_id, Clubs.club_id))
          .orderBy(Events.start_time)
      : await (async () => {
          const ids = await getAllowedClubIds(user.orgSlugs, user.email);
          if (ids.length === 0) return [];
          return db
            .select({
              event_id: Events.event_id,
              club_id: Events.club_id,
              name: Events.name,
              description: Events.description,
              start_time: Events.start_time,
              end_time: Events.end_time,
              location: Events.location,
              link: Events.link,
              requirements: Events.requirements,
              imageUrl: Events.imageUrl,
              club_name: Clubs.name,
            })
            .from(Events)
            .leftJoin(Clubs, eq(Events.club_id, Clubs.club_id))
            .where(inArray(Events.club_id, ids))
            .orderBy(Events.start_time);
        })();

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { club_id, name, description, start_time, end_time, location, link, requirements } = body;

  if (!club_id || !name || !description || !start_time || !end_time || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Org-admins may only post to their own clubs
  if (user.role === 'O') {
    const allowed = await getAllowedClubIds(user.orgSlugs, user.email);
    if (!allowed.includes(Number(club_id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const [event] = await db
    .insert(Events)
    .values({
      club_id: Number(club_id),
      name,
      description,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      location,
      link: link || '',
      requirements: requirements || '',
      imageUrl: null,
    })
    .returning();

  bust(CACHE_TAGS.events);
  return NextResponse.json({ success: true, event });
}

export async function PATCH(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { event_id, club_id, name, description, start_time, end_time, location, link, requirements, imageUrl } = body;

  if (!event_id) return NextResponse.json({ error: 'event_id required' }, { status: 400 });

  // Verify ownership for org-admins
  if (user.role === 'O') {
    const [existing] = await db.select().from(Events).where(eq(Events.event_id, Number(event_id)));
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const allowed = await getAllowedClubIds(user.orgSlugs, user.email);
    if (!allowed.includes(existing.club_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const updateData: Record<string, unknown> = {};
  if (club_id !== undefined) updateData.club_id = Number(club_id);
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (start_time !== undefined) updateData.start_time = new Date(start_time);
  if (end_time !== undefined) updateData.end_time = new Date(end_time);
  if (location !== undefined) updateData.location = location;
  if (link !== undefined) updateData.link = link;
  if (requirements !== undefined) updateData.requirements = requirements;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

  const [event] = await db.update(Events).set(updateData).where(eq(Events.event_id, Number(event_id))).returning();
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  bust(CACHE_TAGS.events);
  return NextResponse.json({ success: true, event });
}

export async function DELETE(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const event_id = searchParams.get('event_id');
  if (!event_id) return NextResponse.json({ error: 'event_id required' }, { status: 400 });

  const [existing] = await db.select().from(Events).where(eq(Events.event_id, Number(event_id)));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role === 'O') {
    const allowed = await getAllowedClubIds(user.orgSlugs, user.email);
    if (!allowed.includes(existing.club_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  await db.delete(Events).where(eq(Events.event_id, Number(event_id)));
  bust(CACHE_TAGS.events);
  return NextResponse.json({ success: true });
}
