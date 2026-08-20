import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/windows/office365";

export default function Office365Page() {
  return <FrostContentPage guide={getFrostGuide("windows/office365")} contributions={getFrostContributions(path)} />;
}
