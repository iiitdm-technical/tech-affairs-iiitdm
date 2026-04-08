import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Orgs } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const rows = await db
    .select()
    .from(Orgs)
    .orderBy(asc(Orgs.category), asc(Orgs.sort_order));
  return NextResponse.json(rows);
}
