import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Orgs } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export const revalidate = 300;

const getOrgs = unstable_cache(
  async () => {
    return db
      .select()
      .from(Orgs)
      .orderBy(asc(Orgs.category), asc(Orgs.sort_order));
  },
  ['api-orgs-all'],
  { revalidate, tags: [CACHE_TAGS.orgs] }
);

export async function GET() {
  const rows = await getOrgs();

  const isECellRecord = (row: { name?: string; link?: string }) => {
    const name = String(row.name ?? '').toLowerCase();
    const link = String(row.link ?? '').toLowerCase();
    return name.includes('ecell') || link.includes('ecell');
  };

  const filteredRows = rows.filter((row) => {
    if (!isECellRecord(row)) return true;
    const link = String(row.link ?? '').toLowerCase();
    return link.includes('/clubs/ecell');
  });

  return NextResponse.json(filteredRows, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1200',
    },
  });
}
