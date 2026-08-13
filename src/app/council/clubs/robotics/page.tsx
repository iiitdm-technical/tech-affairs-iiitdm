import React from 'react';
import ClubPageTemplate from '@/components/ClubPageTemplate';

const clubData = {
  name: 'Robotics Club',
  logo: '/clubs/robotics/logo.webp',
  description: `The Robotics Club at IIITDM Kancheepuram is a student-driven community dedicated to exploring and advancing the field of robotics and automation. The club provides hands-on experience in designing, building, and programming autonomous robots and automated systems, encouraging members to apply their theoretical knowledge in practical scenarios.\nStudents work on interdisciplinary projects involving embedded systems, computer vision, control systems, and mechanical design, developing solutions for real-world applications such as industrial automation, intelligent vehicles, and smart systems.\nThe club actively participates in national and international robotics competitions and conducts workshops, hackathons, and technical sessions to nurture a culture of innovation, teamwork, and problem-solving within the robotics domain.`,
  core: [
    {
      name: 'Santhana Sreenivasa S',
      role: 'Club Lead',
      image: '/clubs/robotics/headcores/santhana.webp',
      email: 'me24b1017@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/santhana-sreenivasa-s-5674bb37a',
      roll: 'ME24B1017',
    },
    {
      name: 'Sanathkumar S Choudhari',
      role: 'Club Lead',
      image: '/clubs/robotics/headcores/sanathkumar.webp',
      email: 'ec24i2026@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/sanath-s-choudhari-260812313',
      roll: 'EC24I2026',
    },
  ],
  links: {}
};

function RoboticsClub() {
  return <ClubPageTemplate {...clubData} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default RoboticsClub;
