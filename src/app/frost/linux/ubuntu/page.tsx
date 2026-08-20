import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/linux/ubuntu";

export default function UbuntuPage() {
  return <FrostContentPage guide={getFrostGuide("linux/ubuntu")} contributions={getFrostContributions(path)} />;
}
