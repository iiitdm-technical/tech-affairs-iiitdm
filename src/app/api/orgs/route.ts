import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Orgs } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';
import { clubs, teams, societies, communities } from '@/data/orgs';

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

  const fallback = [
    ...clubs.map((item) => ({ ...item, category: 'club', id: 0, sort_order: 0 })),
    ...teams.map((item) => ({ ...item, category: 'team', id: 0, sort_order: 0 })),
    ...societies.map((item) => ({ ...item, category: 'society', id: 0, sort_order: 0 })),
    ...communities.map((item) => ({ ...item, category: 'community', id: 0, sort_order: 0 })),
  ];

  const merged = [...fallback, ...filteredRows].filter((row, index, array) => {
    const key = `${row.category}:${row.link}`;
    return array.findIndex((item) => `${item.category}:${item.link}` === key) === index;
  });

  return NextResponse.json(merged, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1200',
    },
  });
}
