import React from 'react';
import TeamPageTemplate from '../../../../components/TeamPageTemplate';

const teamInfo = {
  name: 'Team Shunya',
  club: 'MARS Club',
  logo: '/teams/mars/logo.webp',
  description: `Team Shunya is the official competitive team of the MARS Club at IIITDM Kancheepuram, specializing in the development of autonomous planetary rovers and robotic systems. The team represents the institute in prestigious competitions such as the Indian Rover Challenge (IRC) and ISRO Rover Challenge (IRoC), where student teams design and demonstrate rovers capable of performing complex tasks in simulated extraterrestrial environments.\nTeam Shunya focuses on end-to-end rover development, covering areas such as:\nMechanical design of rugged, all-terrain unmanned ground vehicles (UGVs)\n\nAutonomous navigation and obstacle avoidance\n\nRobotic arm systems for manipulation tasks\n\nEmbedded systems and power management\n\nSensor integration for real-time data acquisition and environment mapping\n\nCombining innovation, technical rigor, and collaborative problem-solving, Team Shunya pushes the boundaries of autonomous ground robotics, preparing students for the challenges of space robotics and exploration missions.`,
  achievements: [
    {
      title: 'European Rover Challenge',
      description: '6th place (Remote) and 21st place (Onsite) internationally',
      year: '2023',
      highlight: true
    },
     {
      title: 'European Rover Challenge Proposal Round',
      description: '2nd place internationally (Remote)',
      year: '2023',
      highlight: false
    },
    {
      title: 'International Rover Challenge',
      description: '21st place internationally (Onsite)',
      year: '2024',
      highlight: true
    },
    {
      title: 'Australian Rover Challenge',
      description: '5th place (Documentation) and 12th place (Onsite) internationally',
      year: '2024',
      highlight: false
    },
     {
      title: 'ISRO Robotics Challenge (IRoC)',
      description: '6th place internationally (Onsite) , winning a prize money of 2 lakhs',
      year: '2024',
      highlight: true
    },
     {
      title: 'National Space Day Recognition',
      description: `On National Space Day, our team was invited to Bharat Mandapam in Delhi by ISRO to participate in the maiden celebration, where we presented our rover to the Hon'ble President of India, Smt.Droupadi Murmu`,
      year: '2024',
      highlight: false
    },
     {
      title: 'International Rover Challenge',
      description: '16th place internationally (Onsite)',
      year: '2025',
      highlight: true
    }
    
  ],
  members: [
    {
      name: 'Sandheep Rahul V',
      role: 'Team Lead',
      image: '/teams/mars/sandheep.webp',
      email: 'me24b2028@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/sandheep-rahul-171159348',
      year: 'B.Tech 2nd Year',
      department: 'Mechanical Engineering',
      roll: 'ME24B2028'
    },
    {
      name: 'Avinash Acharya',
      role: 'Co-Lead / Technical Lead',
      image: '/teams/mars/avinash.webp',
      email: 'me24b1060@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/avinash-acharya-8557ab2ba',
      year: 'B.Tech 2nd Year',
      department: 'Mechanical Engineering',
      roll: 'ME24B1060'
    },
  ],
  website: '#',
};

function MarsShunya() {
  return <TeamPageTemplate {...teamInfo} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default MarsShunya; 
