import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/linux/gentoo";

export default function GentooPage() {
  return <FrostContentPage guide={getFrostGuide("linux/gentoo")} contributions={getFrostContributions(path)} />;
}
