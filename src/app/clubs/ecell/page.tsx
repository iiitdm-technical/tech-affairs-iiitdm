import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import { getOrganizationProfile } from "@/lib/data/organizations";

const profile = getOrganizationProfile("societies/ecell");

export default function OrganizationPage() {
  return <NewClubPageTemplate {...profile} />;
}
