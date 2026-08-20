import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/windows/teams";

export default function TeamsPage() {
  return <FrostContentPage guide={getFrostGuide("windows/teams")} contributions={getFrostContributions(path)} />;
}
