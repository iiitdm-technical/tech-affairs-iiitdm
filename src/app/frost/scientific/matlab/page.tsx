import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/scientific/matlab";

export default function MatlabPage() {
  return <FrostContentPage guide={getFrostGuide("scientific/matlab")} contributions={getFrostContributions(path)} />;
}
