// Admin Frost contributions API
// GET    /admin/api/frost          — all contributions (pending/approved/rejected, including deleted)
// PATCH  /admin/api/frost          — approve or reject a contribution { id, status: 'approved'|'rejected' }
// DELETE /admin/api/frost?id=...   — soft-delete (marks deleted_at + deleted_by)

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { FrostContributions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

async function requireAdmin() {
  const { session, user } = await getCurrentSession();
  if (!session || !user || user.role !== 'A') return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(FrostContributions)
    .orderBy(desc(FrostContributions.created_at));

  return NextResponse.json(rows);
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await request.json();
  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'id and status (approved|rejected) required' }, { status: 400 });
  }

  const [row] = await db
    .update(FrostContributions)
    .set({ status, reviewed_by: user.name, reviewed_at: new Date() })
    .where(eq(FrostContributions.id, Number(id)))
    .returning();

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, contribution: row });
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(new URL(request.url).searchParams.get('id') ?? '');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const [row] = await db
    .update(FrostContributions)
    .set({ deleted_at: new Date(), deleted_by: user.name })
    .where(eq(FrostContributions.id, id))
    .returning();

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
