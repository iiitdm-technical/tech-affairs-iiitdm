import type { ClubPageData } from "@/types/club";

import clubCs from "../../../data/organizations/profiles/clubs/cs.json";
import clubCybersecurity from "../../../data/organizations/profiles/clubs/cybersecurity.json";
import clubDev from "../../../data/organizations/profiles/clubs/dev.json";
import clubRobotics from "../../../data/organizations/profiles/clubs/robotics.json";
import clubScc from "../../../data/organizations/profiles/clubs/scc.json";
import clubSmartSense from "../../../data/organizations/profiles/clubs/smart-sense.json";
import communityGameDevelopers from "../../../data/organizations/profiles/communities/gamedevelopers.json";
import societyAsme from "../../../data/organizations/profiles/societies/asme.json";
import societyEcell from "../../../data/organizations/profiles/societies/ecell.json";
import societyIeee from "../../../data/organizations/profiles/societies/ieee.json";
import societyOptica from "../../../data/organizations/profiles/societies/optica.json";
import teamAstra from "../../../data/organizations/profiles/teams/astra.json";
import teamNira from "../../../data/organizations/profiles/teams/nira.json";
import teamRevolt from "../../../data/organizations/profiles/teams/revolt.json";
import teamShunya from "../../../data/organizations/profiles/teams/shunya.json";
import teamTad from "../../../data/organizations/profiles/teams/tad.json";

const profiles = {
  "clubs/cs": clubCs,
  "clubs/cybersecurity": clubCybersecurity,
  "clubs/dev": clubDev,
  "clubs/robotics": clubRobotics,
  "clubs/scc": clubScc,
  "clubs/smart-sense": clubSmartSense,
  "communities/gamedevelopers": communityGameDevelopers,
  "societies/asme": societyAsme,
  "societies/ecell": societyEcell,
  "societies/ieee": societyIeee,
  "societies/optica": societyOptica,
  "teams/astra": teamAstra,
  "teams/nira": teamNira,
  "teams/revolt": teamRevolt,
  "teams/shunya": teamShunya,
  "teams/tad": teamTad,
} satisfies Record<string, ClubPageData>;

export type OrganizationProfileId = keyof typeof profiles;

export const organizationProfiles: Readonly<
  Record<OrganizationProfileId, ClubPageData>
> = profiles;

export function getOrganizationProfile(
  id: OrganizationProfileId,
): ClubPageData {
  return organizationProfiles[id];
}
