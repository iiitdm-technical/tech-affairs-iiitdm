import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import { getOrganizationProfile } from "@/lib/data/organizations";

const profile = getOrganizationProfile("communities/gamedevelopers");

export default function OrganizationPage() {
  return <NewClubPageTemplate {...profile} />;
}
