import React from 'react';
import TeamPageTemplate from '../../../../components/TeamPageTemplate';

const teamInfo = {
  name: 'Revolt Racers',
  club: 'SAE Club',
  logo: '/teams/revolt/logo.webp',
  description: `ReVolt Racers is the E-Baja team of IIITDM Kancheepuram, specializing in the design and construction of electric all-terrain vehicles for Baja SAE India’s E-Baja competition. The team integrates expertise in electric powertrains, battery management systems, and control systems to build sustainable, high-performance off-road vehicles.\nReVolt Racers emphasizes the practical application of electric vehicle technologies, promoting sustainable mobility while equipping members with critical skills in the growing field of electric automotive engineering.`,
  achievements: [
    {
      title: 'Phase 1 of SAE eBaja',
      description: 'Achieved All India Rank of 16 in 86 teams all over the nation. With this rank we were standing at 4th in Tamil Nadu and we were 5th in all the debutant teams that participated',
      year: '2024',
      highlight: true
    },
    {
      title: 'Phase 2 of SAE eBaja',
      description: `Achieved Overall VDE-AIR 5, Design-AIR 25, Cost-AIR 20, Sustainability: AIR 7 `,
      year: '2024',
      highlight: false
    },
    {
      title: 'Phase 3 of SAE eBaja',
      description: 'We successfully concluded our competition with an All-India Rank of 35 out of 86 teams',
      year: '2025',
      highlight: true
    },
     {
      title: 'Phase 1 of SAE mBaja',
      description: `Achieved an overall rank AIR 9 and TamilNadu rank 2`,
      year: '2024',
      highlight: false
    },
     {
      title: 'Phase 2 of SAE mBaja',
      description: 'Secured ranks below AIR 10 for specific events in Phase 2 and got selected for the finals of the CAE,Design, and Cost events.',
      year: '2024',
      highlight: true
    },
     {
      title: 'Phase 3 of SAE mBaja',
      description: `Considering our performance across all three phases, Team Rebel Racers 3.0 secured an impressive overall All India Rank (AIR) of 18`,
      year: '2025',
      highlight: false
    },

  ],
  members: [
    {
      name: 'Mohamed Asif',
      role: 'Manager',
      image: '/teams/revolt/asif.webp',
      email: 'ME23B2012@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/mohamedasif-iiitdm/',
      year: 'B.Tech 3rd Year',
      department: 'Mechanical Engineering',
      roll: 'ME23B2012'
    },
    {
      name: 'V Gurubaran',
      role: 'Captain',
      image: '/teams/revolt/gurubaran.webp',
      email: 'me23b1042@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/gurubaran-v-9a31522bb/',
      year: 'B.Tech 3rd Year',
      department: 'Mechanical Engineering',
      roll: 'ME23B1042'
    },
    {
      name: 'Abishek.S',
      role: 'Vice-Captain',
      image: '/teams/revolt/abishek.webp',
      email: 'me24b1053@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/abishek-s-8a372a324',
      year: 'B.Tech 2nd Year',
      department: 'Mechanical Engineering',
      roll: 'ME24B1053'
    }
  ],
  website: 'https://revolt.iiitdm.ac.in'
};

function SAEEBaja() {
  return <TeamPageTemplate {...teamInfo} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default SAEEBaja; 
