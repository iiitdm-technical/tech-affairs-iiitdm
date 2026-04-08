import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, invalidateSession, invalidateUserSessions } from '@/lib/server/session';
import { db } from '@/db';
import { Sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET — list all sessions for current user
export async function GET() {
  const { session, user } = await getCurrentSession();
  if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = await db
    .select({ session_id: Sessions.session_id, expires_at: Sessions.expires_at })
    .from(Sessions)
    .where(eq(Sessions.user_id, user.id));

  return NextResponse.json(
    sessions.map((s) => ({
      id: s.session_id,
      expiresAt: s.expires_at,
      current: s.session_id === session.id,
    }))
  );
}

// DELETE — revoke a specific session or all other sessions
export async function DELETE(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, revokeAll } = await request.json();

  if (revokeAll) {
    // Revoke all sessions except current
    const allSessions = await db
      .select({ session_id: Sessions.session_id })
      .from(Sessions)
      .where(eq(Sessions.user_id, user.id));

    for (const s of allSessions) {
      if (s.session_id !== session.id) {
        await invalidateSession(s.session_id);
      }
    }
    return NextResponse.json({ success: true, revoked: allSessions.length - 1 });
  }

  if (sessionId) {
    // Verify this session belongs to the current user
    const target = await db
      .select({ user_id: Sessions.user_id })
      .from(Sessions)
      .where(eq(Sessions.session_id, sessionId))
      .limit(1);

    if (!target.length || target[0].user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await invalidateSession(sessionId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'sessionId or revokeAll required' }, { status: 400 });
}
