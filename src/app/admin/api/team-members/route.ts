import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { TeamMembers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== 'A')
    return { user: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { user, err: null };
}

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  const rows = await db
    .select()
    .from(TeamMembers)
    .orderBy(asc(TeamMembers.team_slug), asc(TeamMembers.sub_role), asc(TeamMembers.sort_order));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { team_slug, sub_role, name, roll, email, linkedin, image, sort_order } = body;
  if (!team_slug || !name) return NextResponse.json({ error: 'team_slug and name required' }, { status: 400 });
  const [row] = await db.insert(TeamMembers).values({
    team_slug,
    sub_role: sub_role || 'coordinator',
    name,
    roll: roll || '',
    email: email || '',
    linkedin: linkedin || '',
    image: image || '',
    sort_order: sort_order ?? 0,
    active: 'Y',
  }).returning();
  return NextResponse.json({ success: true, member: row });
}

export async function PATCH(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const update: Record<string, unknown> = {};
  for (const key of ['team_slug', 'sub_role', 'name', 'roll', 'email', 'linkedin', 'image', 'sort_order', 'active'] as const) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  const [row] = await db.update(TeamMembers).set(update).where(eq(TeamMembers.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, member: row });
}

export async function DELETE(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(TeamMembers).where(eq(TeamMembers.id, Number(id)));
  return NextResponse.json({ success: true });
}
