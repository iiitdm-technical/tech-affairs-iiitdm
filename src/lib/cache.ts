import { revalidateTag } from 'next/cache';

export const CACHE_TAGS = {
  orgs: 'orgs',
  team: 'team',
  teamMembers: 'team-members',
  achievements: 'achievements',
  announcements: 'announcements',
  highlights: 'highlights',
  sponsors: 'sponsors',
  frost: 'frost',
  events: 'events',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export function bust(...tags: CacheTag[]) {
  for (const tag of tags) revalidateTag(tag);
}
