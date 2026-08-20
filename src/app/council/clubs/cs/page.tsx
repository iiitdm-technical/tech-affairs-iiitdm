import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import { getOrganizationProfile } from "@/lib/data/organizations";

const profile = getOrganizationProfile("clubs/cs");

export default function OrganizationPage() {
  return <NewClubPageTemplate {...profile} />;
}
