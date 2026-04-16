import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { OrgAdmins, User_roles } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

function requireAdmin(user: { role: string } | null) {
  if (!user || user.role !== 'A') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const { user } = await getCurrentSession();
  const err = requireAdmin(user);
  if (err) return err;

  const rows = await db.select().from(OrgAdmins).orderBy(OrgAdmins.email);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { user } = await getCurrentSession();
  const err = requireAdmin(user);
  if (err) return err;

  const { email, org_slug } = await request.json();
  if (!email || !org_slug) {
    return NextResponse.json({ error: 'email and org_slug are required' }, { status: 400 });
  }

  // Ensure org-admin role exists without touching other roles.
  await db
    .insert(User_roles)
    .values({ email, role: 'O' })
    .onConflictDoNothing({ target: [User_roles.email, User_roles.role] });

  const [row] = await db.insert(OrgAdmins).values({ email, org_slug }).returning();
  return NextResponse.json({ success: true, row });
}

export async function DELETE(request: NextRequest) {
  const { user } = await getCurrentSession();
  const err = requireAdmin(user);
  if (err) return err;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await db.delete(OrgAdmins).where(eq(OrgAdmins.id, Number(id)));

  // If this email has no more org_admin rows, downgrade role to 'U'
  const { email } = (await request.json().catch(() => ({ email: null }))) as { email?: string };
  if (email) {
    const remaining = await db.select().from(OrgAdmins).where(eq(OrgAdmins.email, email));
    if (remaining.length === 0) {
      await db.delete(User_roles).where(and(eq(User_roles.email, email), eq(User_roles.role, 'O')));
    }
  }

  return NextResponse.json({ success: true });
}
