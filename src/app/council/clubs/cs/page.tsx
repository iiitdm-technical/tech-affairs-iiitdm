import React from 'react';
import ClubPageTemplate from '@/components/ClubPageTemplate';

const clubData = {
  name: 'CS Club',
  logo: '/clubs/csclub/logo.webp',
  description: `The CS Club of IIITDM Kancheepuram is a student-led community that aims to foster interest, learning, and collaboration in the field of computer science. It serves as a platform where students can enhance their technical skills, explore various domains such as competitive programming, software development, and open-source contributions, and engage in meaningful learning experiences beyond the classroom. The club organizes workshops, coding contests, and speaker sessions, while also encouraging students to participate in national and international competitions. By facilitating peer-to-peer learning and collaboration, the CS Club strives to build a strong and active technical community within the institute and to create opportunities for students to grow as innovators, developers, and problem solvers.`,
  core: [
    {
      name: 'Dhanya Venkatesh',
      role: 'Head Core',
      image: '/clubs/csclub/headcores/dhanya.webp',
      email: 'me23b2010@iiitdm.ac.in',
      linkedin: '',
      roll: 'ME23B2010',
    },
    {
      name: 'Parth Pandey',
      role: 'Tech Lead',
      image: '/clubs/csclub/headcores/parth.webp',
      email: 'cs23i1064@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/parth-pandey-b20932299',
      roll: 'CS23I1064',
    },
  ],
  links: {
    website: 'https://csclub.netlify.app/',
    instagram:'https://www.instagram.com/cs.club.iiitdm/',
    github: 'https://github.com/cs-iiitdm'
  }
};

function CSClub() {
  return <ClubPageTemplate {...clubData} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default CSClub; 
