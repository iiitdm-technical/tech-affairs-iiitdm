import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/scientific/comsol";

export default function ComsolPage() {
  return <FrostContentPage guide={getFrostGuide("scientific/comsol")} contributions={getFrostContributions(path)} />;
}
