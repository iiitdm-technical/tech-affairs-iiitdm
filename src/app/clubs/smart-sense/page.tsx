import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import { getOrganizationProfile } from "@/lib/data/organizations";

const profile = getOrganizationProfile("clubs/smart-sense");

export default function OrganizationPage() {
  return <NewClubPageTemplate {...profile} />;
}
