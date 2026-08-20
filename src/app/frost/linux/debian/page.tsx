import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/linux/debian";

export default function DebianPage() {
  return <FrostContentPage guide={getFrostGuide("linux/debian")} contributions={getFrostContributions(path)} />;
}
