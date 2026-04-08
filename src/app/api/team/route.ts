import { NextResponse } from 'next/server';
import { db } from '@/db';
import { TechAffairsTeam } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  const rows = await db
    .select()
    .from(TechAffairsTeam)
    .where(eq(TechAffairsTeam.active, 'Y'))
    .orderBy(asc(TechAffairsTeam.type), asc(TechAffairsTeam.sort_order));
  return NextResponse.json(rows);
}
