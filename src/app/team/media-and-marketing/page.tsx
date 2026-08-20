import TeamSubPage from '@/components/TeamSubPage';
import { getTechnicalAffairsTeam } from '@/lib/data/content';

const team = getTechnicalAffairsTeam('media-and-marketing');

export default function MediaAndMarketingPage() {
  return (
    <TeamSubPage
      {...team}
    />
  );
}
