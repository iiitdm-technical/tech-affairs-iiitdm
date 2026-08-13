import React from 'react';
import TeamPageTemplate from '../../../../components/TeamPageTemplate';

const teamInfo = {
  name: 'Team Tad',
  club: 'TAD Club',
  logo: '/teams/tad/logo.webp',
  description: `The Talpade Aero Design (TAD) team at IIITDM Kancheepuram is a vibrant and fast-growing student organization dedicated to advancing the field of aeronautical design and engineering. Bringing together passionate and curious engineering minds, the club focuses on the design, construction, and optimization of high-performance RC planes.\nWith a strong emphasis on precision engineering and innovation, TAD Club builds aircraft that compete in national-level aeromodeling competitions, where students apply their skills in aerodynamics, structural design, propulsion, and control systems. The club serves as a collaborative platform for like-minded individuals who are driven to push the boundaries of RC plane design and aerial vehicle development.\nThrough hands-on projects, workshops, and competitions, TAD Club nurtures technical excellence, teamwork, and creativity, inspiring the next generation of aerospace innovators.`,
  achievements: [
    {
      title: 'IIT Bombay Competition',
      description: `TAD participated with two teams and both of the teams sucessfully cleared the abstract round and they made into the top 50's out of 500 teams by flying RC planes with payload`,
      year: '2024',
      highlight: true
    },
    {
      title: 'IIT Madras-Boeing National Aeromodelling Competition',
      description: 'TAD participated with six teams comprising one senior team and five junior teams and all these teams sucessfully cleared the abstract round',
      year: '2024',
      highlight: false
    },
    {
      title: 'IAC-Conference by ASoI',
      description: 'TAD won RUNNER-UP at the Industrial Academia Conclave 2024 by ASoI, for designing a docking mechanism to charge electric-hybrid UAVs, supporting sustainable aviation in India',
      year: '2024',
      highlight: true
    }
  ],
  members: [
    {
      name: 'Hanush P V',
      role: 'Club Lead',
      image: '/teams/tad/hanush.webp',
      email: 'ME23B1017@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/hanush-p-v/',
      year: 'B.Tech 3rd Year',
      department: 'Mechanical Engineering',
      roll: 'ME23B1017'
    },
  ],
  website: 'https://tad.iiitdm.ac.in'
};

function TalpadeAeroDesign() {
  return <TeamPageTemplate {...teamInfo} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default TalpadeAeroDesign; 
