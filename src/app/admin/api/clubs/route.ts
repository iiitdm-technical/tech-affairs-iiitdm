import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Clubs, OrgAdmins, User_roles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { CACHE_TAGS, bust } from '@/lib/cache';

export async function GET() {
  const { session, user } = await getCurrentSession();
  if (!session || !user || user.role !== 'A')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clubs = await db.select().from(Clubs).orderBy(Clubs.name);
  return NextResponse.json(clubs);
}

export async function POST(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || user.role !== 'A')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, authorized_email, org_slug } = await request.json();
  if (!name) return NextResponse.json({ error: 'Club name is required' }, { status: 400 });

  const [club] = await db
    .insert(Clubs)
    .values({ name, iconUrl: '', authorized_email: authorized_email ?? '', org_slug: org_slug ?? '' })
    .returning();

  // Auto-assign org admin if email + slug provided
  if (authorized_email && org_slug) {
    await db.insert(OrgAdmins).values({ email: authorized_email, org_slug });
    await db
      .insert(User_roles)
      .values({ email: authorized_email, role: 'O' })
      .onConflictDoNothing({ target: [User_roles.email, User_roles.role] });
  }

  bust(CACHE_TAGS.orgs);
  return NextResponse.json({ success: true, club });
}

export async function PATCH(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || user.role !== 'A')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { club_id, name, iconUrl, authorized_email, org_slug } = await request.json();
  if (!club_id) return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

  // Get existing club to detect email/slug changes
  const [existing] = await db.select().from(Clubs).where(eq(Clubs.club_id, club_id));
  if (!existing) return NextResponse.json({ error: 'Club not found' }, { status: 404 });

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
  if (authorized_email !== undefined) updateData.authorized_email = authorized_email;
  if (org_slug !== undefined) updateData.org_slug = org_slug;

  const [club] = await db.update(Clubs).set(updateData).where(eq(Clubs.club_id, club_id)).returning();

  // Remove old org_admin entry if email/slug changed
  const oldEmail = existing.authorized_email;
  const oldSlug = existing.org_slug;
  const newEmail = authorized_email ?? oldEmail;
  const newSlug = org_slug ?? oldSlug;

  if ((oldEmail || oldSlug) && (oldEmail !== newEmail || oldSlug !== newSlug)) {
    if (oldEmail && oldSlug) {
      await db.delete(OrgAdmins).where(
        and(eq(OrgAdmins.email, oldEmail), eq(OrgAdmins.org_slug, oldSlug))
      );
      // Downgrade role if no other org_admin rows for this email
      const remaining = await db.select().from(OrgAdmins).where(eq(OrgAdmins.email, oldEmail));
      if (remaining.length === 0) {
        await db.delete(User_roles).where(and(eq(User_roles.email, oldEmail), eq(User_roles.role, 'O')));
      }
    }
  }

  // Upsert new org_admin entry
  if (newEmail && newSlug) {
    const exists = await db.select().from(OrgAdmins).where(
      and(eq(OrgAdmins.email, newEmail), eq(OrgAdmins.org_slug, newSlug))
    );
    if (exists.length === 0) {
      await db.insert(OrgAdmins).values({ email: newEmail, org_slug: newSlug });
    }
    await db
      .insert(User_roles)
      .values({ email: newEmail, role: 'O' })
      .onConflictDoNothing({ target: [User_roles.email, User_roles.role] });
  }

  bust(CACHE_TAGS.orgs);
  return NextResponse.json({ success: true, club });
}

export async function DELETE(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || user.role !== 'A')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const club_id = new URL(request.url).searchParams.get('club_id');
  if (!club_id) return NextResponse.json({ error: 'Club ID is required' }, { status: 400 });

  const [club] = await db.select().from(Clubs).where(eq(Clubs.club_id, parseInt(club_id)));
  if (!club) return NextResponse.json({ error: 'Club not found' }, { status: 404 });

  // Remove org_admin entry and downgrade role
  if (club.authorized_email && club.org_slug) {
    await db.delete(OrgAdmins).where(
      and(eq(OrgAdmins.email, club.authorized_email), eq(OrgAdmins.org_slug, club.org_slug))
    );
    const remaining = await db.select().from(OrgAdmins).where(eq(OrgAdmins.email, club.authorized_email));
    if (remaining.length === 0) {
      await db.delete(User_roles).where(and(eq(User_roles.email, club.authorized_email), eq(User_roles.role, 'O')));
    }
  }

  await db.delete(Clubs).where(eq(Clubs.club_id, parseInt(club_id)));
  bust(CACHE_TAGS.orgs);
  return NextResponse.json({ success: true });
}
