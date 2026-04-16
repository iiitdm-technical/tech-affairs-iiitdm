import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';

export async function GET() {
  try {
    const { session, user } = await getCurrentSession();

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      roles: user.roles,
      orgSlugs: user.orgSlugs,
    });
  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
