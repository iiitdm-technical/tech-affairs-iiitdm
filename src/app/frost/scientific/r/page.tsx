import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/scientific/r";

export default function RPage() {
  return <FrostContentPage guide={getFrostGuide("scientific/r")} contributions={getFrostContributions(path)} />;
}
