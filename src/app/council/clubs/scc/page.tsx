import React from 'react';
import ClubPageTemplate from '@/components/ClubPageTemplate';

const clubData = {
  name: 'System Coding Club (SCC)',
  logo: '/clubs/Scc/logo.webp',
  description: `The Systems Coding Club (SSC) at IIITDM Kancheepuram is dedicated to empowering students with practical skills in hardware-level programming and system design. The club focuses on teaching and applying Verilog, Embedded Systems, and MATLAB, preparing students to tackle real-world industrial challenges in electronics and automation.\nSSC encourages students to take on hands-on projects in these areas, fostering a deep understanding of how software interacts with hardware. The club also supports students in accessing and understanding research articles relevant to electronics, embedded design, and digital systems.`,
  core: [
    {
      name: 'Lohith Chandra Gogineni',
      role: 'Club Lead',
      image: '/clubs/Scc/headcores/lohith.webp',
      email: 'ec24i1006@iiitdm.ac.in',
      linkedin: '',
      roll: 'EC24I1006'
    }
  ],
  links: {
    instagram: 'https://www.instagram.com/systemcodingclub_iiitdm/',
    github: 'https://github.com/SCC-IIITDM'
  }
};

function SCC() {
  return <ClubPageTemplate {...clubData} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default SCC; 
