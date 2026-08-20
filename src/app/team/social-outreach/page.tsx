import TeamSubPage from '@/components/TeamSubPage';
import { getTechnicalAffairsTeam } from '@/lib/data/content';

const team = getTechnicalAffairsTeam('social-outreach');

export default function MediaAndOutreachPage() {
  return (
    <TeamSubPage
      {...team}
    />
  );
}
