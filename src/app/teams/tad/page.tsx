import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import { getOrganizationProfile } from "@/lib/data/organizations";

const profile = getOrganizationProfile("teams/tad");

export default function OrganizationPage() {
  return <NewClubPageTemplate {...profile} />;
}
