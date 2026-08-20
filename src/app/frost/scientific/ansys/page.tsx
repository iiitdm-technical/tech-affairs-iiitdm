import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/scientific/ansys";

export default function AnsysPage() {
  return <FrostContentPage guide={getFrostGuide("scientific/ansys")} contributions={getFrostContributions(path)} />;
}
