import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/scientific/python";

export default function PythonPage() {
  return <FrostContentPage guide={getFrostGuide("scientific/python")} contributions={getFrostContributions(path)} />;
}
