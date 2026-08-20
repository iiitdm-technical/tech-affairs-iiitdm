import { organizations, type Organization } from '@/lib/data/content';

export type OrgItem = Organization;

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
  return organizations;
}

export function useOrgsByCategory(category: string): OrgItem[] {
  const orgs = useOrgs();
  return orgs.filter((o) => o.category === category).sort((a, b) => a.sort_order - b.sort_order);
}
