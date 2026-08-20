import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/scientific/abaqus";

export default function AbaqusPage() {
  return <FrostContentPage guide={getFrostGuide("scientific/abaqus")} contributions={getFrostContributions(path)} />;
}
