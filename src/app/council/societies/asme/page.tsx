import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import { getOrganizationProfile } from "@/lib/data/organizations";

const profile = getOrganizationProfile("societies/asme");

export default function OrganizationPage() {
  return <NewClubPageTemplate {...profile} />;
}
