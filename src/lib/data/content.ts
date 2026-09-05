import achievementsJson from '../../../data/achievements/achievements.json';
import announcementsJson from '../../../data/announcements/announcements.json';
import recruitmentsJson from '../../../data/campaigns/recruitments.json';
import eventsJson from '../../../data/events/events.json';
import highlightsJson from '../../../data/highlights/highlights.json';
import i2rInfoJson from '../../../data/i2r/info.json';
import organizationsJson from '../../../data/organizations/index.json';
import clubsJson from '../../../data/organizations/clubs.json';
import sponsorsJson from '../../../data/sponsors/sponsors.json';
import footerJson from '../../../data/site/footer.json';
import homeJson from '../../../data/site/home.json';
import councilJson from '../../../data/technical-affairs/council.json';
import membersJson from '../../../data/technical-affairs/members.json';
import teamsJson from '../../../data/technical-affairs/teams.json';

export type Organization = {
  id: number;
  name: string;
  image: string;
  link: string;
  category: string;
  sort_order: number;
};

export type Club = {
  club_id: number;
  name: string;
  iconUrl: string;
  org_slug: string;
};

export type Achievement = {
  id: number;
  org_slug: string;
  title: string;
  description: string;
  year: string;
  proof_url: string;
  logo: string;
  image: string;
  created_at: string;
};

export type Event = {
  event_id: number;
  club_id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  location: string;
  start_time: string;
  end_time: string;
  requirements: string;
  link: string;
};

export type Announcement = {
  id: number;
  org_slug: string;
  title: string;
  body: string;
  link: string;
  media_url: string;
  created_at: string;
  event_start?: string;
  event_end?: string;
};

export type Highlight = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  tag: string;
  sort_order: number;
};

export type Sponsor = {
  id: number;
  name: string;
  logo: string;
  website: string;
  tier: string;
  year: string;
};

export type CouncilEntry = {
  id: number;
  type: string;
  name: string;
  position: string;
  image: string;
  email: string;
  linkedin: string;
  url: string;
  path: string;
  sort_order: number;
  active: string;
};

export type TechnicalAffairsMember = {
  id: number;
  team_slug: string;
  sub_role: string;
  name: string;
  roll: string;
  email: string;
  linkedin: string;
  image: string;
  sort_order: number;
  active: string;
};

export type TechnicalAffairsTeam = {
  slug: string;
  title: string;
  description: string;
};

export type RecruitmentCategory = keyof typeof recruitmentsJson.categories;

export const achievements = achievementsJson as Achievement[];
export const announcements = announcementsJson as Announcement[];
export const clubs = clubsJson as Club[];
export const council = councilJson as CouncilEntry[];
export const events = eventsJson as Event[];
export const footerContent = footerJson;
export const highlights = highlightsJson as Highlight[];
export const homeContent = homeJson;
export const i2rInfo = i2rInfoJson;
export const organizations = organizationsJson as Organization[];
export const recruitments = recruitmentsJson;
export const sponsors = sponsorsJson as Sponsor[];
export const technicalAffairsMembers = membersJson as TechnicalAffairsMember[];
export const technicalAffairsTeams = teamsJson as TechnicalAffairsTeam[];

export function isUpcomingAnnouncement(announcement: Announcement, now = new Date()): boolean {
  if (!announcement.event_start) return false;

  const eventEnd = announcement.event_end ?? announcement.event_start;
  const endTime = new Date(eventEnd).getTime();
  return Number.isFinite(endTime) && endTime > now.getTime();
}

export function isUpcomingEvent(event: Event, now = new Date()): boolean {
  const eventEnd = new Date(event.end_time || event.start_time).getTime();
  return Number.isFinite(eventEnd) && eventEnd > now.getTime();
}

export const upcomingAnnouncements = announcements
  .filter((announcement) => isUpcomingAnnouncement(announcement))
  .sort((first, second) => (
    new Date(first.event_start ?? first.created_at).getTime()
    - new Date(second.event_start ?? second.created_at).getTime()
  ));

export function getTechnicalAffairsTeam(slug: string): TechnicalAffairsTeam {
  const team = technicalAffairsTeams.find((entry) => entry.slug === slug);
  if (!team) throw new Error(`Unknown Technical Affairs team: ${slug}`);
  return team;
}
