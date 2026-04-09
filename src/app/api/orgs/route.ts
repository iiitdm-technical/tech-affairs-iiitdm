import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Orgs } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const revalidate = 300;

const getOrgs = unstable_cache(
  async () => {
    return db
      .select()
      .from(Orgs)
      .orderBy(asc(Orgs.category), asc(Orgs.sort_order));
  },
  ['api-orgs-all'],
  { revalidate }
);

export async function GET() {
  const rows = await getOrgs();
  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1200',
    },
  });
}
