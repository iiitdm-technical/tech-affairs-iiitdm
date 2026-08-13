"use client";

import { useState, useEffect } from 'react';
import {
  clubs as staticClubs,
  teams as staticTeams,
  societies as staticSocieties,
  communities as staticCommunities,
} from '@/data/orgs';

export interface OrgItem {
  id: number;
  name: string;
  image: string;
  link: string;
  category: string;
  sort_order: number;
}

let _cache: OrgItem[] | null = null;
let _promise: Promise<OrgItem[]> | null = null;

function staticFallbackOrgs(): OrgItem[] {
  let id = 1;
  const toRows = (category: string, items: Array<{ name: string; image: string; link: string }>) =>
    items.map((item, index) => ({
      id: id++,
      name: item.name,
      image: item.image,
      link: item.link,
      category,
      sort_order: index,
    }));

  return [
    ...toRows('club', staticClubs),
    ...toRows('team', staticTeams),
    ...toRows('society', staticSocieties),
    ...toRows('community', staticCommunities),
  ];
}

async function fetchOrgs(): Promise<OrgItem[]> {
  if (_cache && _cache.length > 0) return _cache;
  if (!_promise) {
    const fallback = staticFallbackOrgs();
    _promise = fetch('/api/orgs')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => {
        const safeRows = Array.isArray(rows) ? rows : [];
        _cache = safeRows.length ? safeRows : fallback;
        return _cache;
      })
      .catch(() => {
        _cache = fallback;
        return fallback;
      });
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
  const [orgs, setOrgs] = useState<OrgItem[]>(_cache ?? []);

  useEffect(() => {
    fetchOrgs().then(setOrgs);
  }, []);

  return orgs;
}

export function useOrgsByCategory(category: string): OrgItem[] {
  const orgs = useOrgs();
  return orgs.filter((o) => o.category === category).sort((a, b) => a.sort_order - b.sort_order);
}
