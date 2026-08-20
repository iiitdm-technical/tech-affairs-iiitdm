import TeamSubPage from '@/components/TeamSubPage';
import { getTechnicalAffairsTeam } from '@/lib/data/content';

const team = getTechnicalAffairsTeam('tech-development');

export default function TechDevelopmentPage() {
  return (
    <TeamSubPage
      {...team}
    />
  );
}
