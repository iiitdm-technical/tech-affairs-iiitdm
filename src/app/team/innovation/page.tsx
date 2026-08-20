import TeamSubPage from '@/components/TeamSubPage';
import { getTechnicalAffairsTeam } from '@/lib/data/content';

const team = getTechnicalAffairsTeam('innovation');

export default function InnovationPage() {
  return (
    <TeamSubPage
      {...team}
    />
  );
}
