import React from 'react';
import ClubPageTemplate from '@/components/ClubPageTemplate';

const clubData = {
  name: 'E-Cell',
  logo: '/societies/Ecell/logo.webp',
  description: `The E-Cell at IIITDM Kancheepuram is dedicated to fostering entrepreneurial spirit and innovation among students. The club provides a platform for aspiring entrepreneurs to learn, collaborate, and transform ideas into viable business ventures. Through workshops, mentorship, and networking events, E-Cell empowers students to develop essential skills in business planning, leadership, and creative problem-solving. E-Cell IIITDM reached the NEC finals at IIT Bombay and secured a Top 25 position out of 4,000 teams across India.`,
  core: [
    {
      name: 'Deethiya Priyadharshini',
      role: 'Core',
      image: '/societies/Ecell/headcores/deethiya.webp',
      email: 'me24b2027@iiitdm.ac.in',
      linkedin: '',
      roll: 'ME24B2027'
    }
  ],
  team: [
    {
      name: 'Alice Johnson',
      role: 'Team Member',
      image: '/images/team/alice-johnson.webp',
      email: 'alice.johnson@iiitdm.ac.in',
      linkedin: 'https://linkedin.com/in/alicejohnson',
      year: 'B.Tech 2nd Year',
      department: 'Computer Science Engineering',
      roll: 'cs23b1003'
    },
    {
      name: 'Bob Wilson',
      role: 'Team Member',
      image: '/images/team/bob-wilson.webp',
      email: 'bob.wilson@iiitdm.ac.in',
      linkedin: 'https://linkedin.com/in/bobwilson',
      year: 'B.Tech 2nd Year',
      department: 'Computer Science Engineering'
    }
  ],
  projects: [
    {
      title: 'NEC Finals at IIT Bombay',
      description: 'E-Cell IIITDM secured Top 25 out of 4,000 teams across India.',
      themeColor: '#7C3AED',
      icons: []
    }
  ],
  links: {
    website: '#',
    instagram: 'https://www.instagram.com/ecell_iiitdm/',
    github: '#'
  }
};

function ECell() {
  return <ClubPageTemplate {...clubData} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default ECell; 
