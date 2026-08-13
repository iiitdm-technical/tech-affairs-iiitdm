"use client";

import { useState, useEffect } from 'react';
import { clubs, teams, societies, communities } from '@/data/orgs';

export interface OrgItem {
  id: number;
  name: string;
  image: string;
  link: string;
  category: string;
  sort_order: number;
}

const staticOrgs: OrgItem[] = [
  ...clubs.map((o, i) => ({ id: i + 1, ...o, category: 'club', sort_order: i + 1 })),
  ...teams.map((o, i) => ({ id: i + 10, ...o, category: 'team', sort_order: i + 1 })),
  ...societies.map((o, i) => ({ id: i + 20, ...o, category: 'society', sort_order: i + 1 })),
  ...communities.map((o, i) => ({ id: i + 30, ...o, category: 'community', sort_order: i + 1 })),
];

let _cache: OrgItem[] | null = null;
let _promise: Promise<OrgItem[]> | null = null;

async function fetchOrgs(): Promise<OrgItem[]> {
  if (_cache) return _cache;
  if (!_promise) {
    _promise = fetch('/api/orgs')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => {
        const result = Array.isArray(rows) && rows.length > 0 ? rows : staticOrgs;
        _cache = result;
        return result;
      })
      .catch(() => staticOrgs);
  }
  return _promise;
}

export function slugToOrg(slug: string, orgs: OrgItem[]): OrgItem | undefined {
  const tail = slug.split('/').pop();
  return orgs.find((o) => o.link.endsWith('/' + tail));
}

export function slugToName(slug: string, orgs: OrgItem[]): string {
  return slugToOrg(slug, orgs)?.name ?? slug;
}

export function slugToLogo(slug: string, orgs: OrgItem[]): string {
  return slugToOrg(slug, orgs)?.image ?? '';
}

export function useOrgs() {
  const [orgs, setOrgs] = useState<OrgItem[]>(_cache ?? staticOrgs);

  useEffect(() => {
    fetchOrgs().then(setOrgs);
  }, []);

  return orgs;
}

export function useOrgsByCategory(category: string): OrgItem[] {
  const orgs = useOrgs();
  return orgs.filter((o) => o.category === category).sort((a, b) => a.sort_order - b.sort_order);
}
