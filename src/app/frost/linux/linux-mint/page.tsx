import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/linux/linux-mint";

export default function LinuxMintPage() {
  return <FrostContentPage guide={getFrostGuide("linux/linux-mint")} contributions={getFrostContributions(path)} />;
}
