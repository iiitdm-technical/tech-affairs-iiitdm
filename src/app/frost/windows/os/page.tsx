import FrostContentPage from "@/components/FrostContentPage";
import { getFrostContributions, getFrostGuide } from "@/lib/data/frost";

const path = "/frost/windows/os";

export default function OsPage() {
  return <FrostContentPage guide={getFrostGuide("windows/os")} contributions={getFrostContributions(path)} />;
}
