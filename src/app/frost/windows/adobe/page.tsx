import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/windows/adobe";

export default function AdobePage() {
  return <FrostContentPage guide={getFrostGuide("windows/adobe")} contributions={getFrostContributions(path)} />;
}
