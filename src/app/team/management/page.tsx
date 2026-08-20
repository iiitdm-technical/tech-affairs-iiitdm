import TeamSubPage from '@/components/TeamSubPage';
import { getTechnicalAffairsTeam } from '@/lib/data/content';

const team = getTechnicalAffairsTeam('management');

export default function ManagementPage() {
  return (
    <TeamSubPage
      {...team}
    />
  );
}
