import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/scientific/materials-studio";

export default function MaterialsStudioPage() {
  return <FrostContentPage guide={getFrostGuide("scientific/materials-studio")} contributions={getFrostContributions(path)} />;
}
