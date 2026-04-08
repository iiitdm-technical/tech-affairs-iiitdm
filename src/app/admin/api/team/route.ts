import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { TechAffairsTeam } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== 'A') return { user: null, err: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { user, err: null };
}

export async function GET() {
  const { err } = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(TechAffairsTeam).orderBy(asc(TechAffairsTeam.type), asc(TechAffairsTeam.sort_order));
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const body = await request.json();
  const { type, name, position, image, email, linkedin, url, path, sort_order } = body;
  if (!type || !name) return NextResponse.json({ error: 'type and name required' }, { status: 400 });
  const [row] = await db.insert(TechAffairsTeam).values({
    type, name,
    position: position || '',
    image: image || '',
    email: email || '',
    linkedin: linkedin || '',
    url: url || '',
    path: path || '',
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
  for (const key of ['type', 'name', 'position', 'image', 'email', 'linkedin', 'url', 'path', 'sort_order', 'active'] as const) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }
  const [row] = await db.update(TechAffairsTeam).set(update).where(eq(TechAffairsTeam.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, member: row });
}

export async function DELETE(request: NextRequest) {
  const { err } = await requireAdmin();
  if (err) return err;
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.delete(TechAffairsTeam).where(eq(TechAffairsTeam.id, Number(id)));
  return NextResponse.json({ success: true });
}
