import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import { getOrganizationProfile } from "@/lib/data/organizations";

const profile = getOrganizationProfile("societies/ieee");

export default function OrganizationPage() {
  return <NewClubPageTemplate {...profile} />;
}
