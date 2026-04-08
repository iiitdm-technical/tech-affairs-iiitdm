import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Orgs, OrgAdmins, User_roles, Clubs } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== 'A') return { user: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { user, err: null };
}

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(Orgs).orderBy(asc(Orgs.category), asc(Orgs.sort_order));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const { name, image, link, category, sort_order, authorized_email } = await request.json();
  if (!name || !link || !category) return NextResponse.json({ error: 'name, link, category required' }, { status: 400 });
  const [row] = await db.insert(Orgs).values({
    name, image: image || '', link, category,
    sort_order: sort_order ?? 0,
    authorized_email: authorized_email || '',
  }).returning();

  // Auto-create org_slug from link and create org admin access
  if (authorized_email) {
    const orgSlug = link.replace(/^\//, ''); // /clubs/cs -> clubs/cs
    await db.insert(OrgAdmins).values({ email: authorized_email, org_slug: orgSlug }).onConflictDoNothing();
    await db.insert(User_roles).values({ email: authorized_email, role: 'O' })
      .onConflictDoUpdate({ target: User_roles.email, set: { role: 'O' } });
  }

  return NextResponse.json({ success: true, org: row });
}

export async function PATCH(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Get existing org to detect email changes
  const [existing] = await db.select().from(Orgs).where(eq(Orgs.id, Number(id)));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const update: Record<string, unknown> = {};
  for (const key of ['name', 'image', 'link', 'category', 'sort_order', 'authorized_email'] as const) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  const [row] = await db.update(Orgs).set(update).where(eq(Orgs.id, Number(id))).returning();

  // Sync org admin access
  const oldEmail = existing.authorized_email;
  const newEmail = fields.authorized_email !== undefined ? fields.authorized_email : oldEmail;
  const orgSlug = (row.link || existing.link).replace(/^\//, '');

  if (oldEmail && oldEmail !== newEmail) {
    await db.delete(OrgAdmins).where(and(eq(OrgAdmins.email, oldEmail), eq(OrgAdmins.org_slug, orgSlug)));
    const remaining = await db.select().from(OrgAdmins).where(eq(OrgAdmins.email, oldEmail));
    if (remaining.length === 0) {
      await db.update(User_roles).set({ role: 'U' }).where(eq(User_roles.email, oldEmail));
    }
  }
  if (newEmail) {
    await db.insert(OrgAdmins).values({ email: newEmail, org_slug: orgSlug }).onConflictDoNothing();
    await db.insert(User_roles).values({ email: newEmail, role: 'O' })
      .onConflictDoUpdate({ target: User_roles.email, set: { role: 'O' } });
  }

  // Also sync to clubs table if linked
  if (existing.club_ref_id) {
    const clubUpdate: Record<string, unknown> = {};
    if (fields.image !== undefined) clubUpdate.iconUrl = fields.image;
    if (fields.authorized_email !== undefined) clubUpdate.authorized_email = fields.authorized_email;
    if (Object.keys(clubUpdate).length > 0) {
      await db.update(Clubs).set(clubUpdate).where(eq(Clubs.club_id, existing.club_ref_id));
    }
  }

  return NextResponse.json({ success: true, org: row });
}

export async function DELETE(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(Orgs).where(eq(Orgs.id, Number(id)));
  return NextResponse.json({ success: true });
}
