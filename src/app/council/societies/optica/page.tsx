import React from 'react';
import SocietyPageTemplate from '../../../../components/SocietyPageTemplate';

const clubData = {
  name: 'Optica Student Chapter',
  logo: '/societies/OpticaStudentChapter/logo.webp',
  description: `The OPTICA Student Chapter at IIITDM Kancheepuram is a student-led community affiliated with OPTICA (formerly OSA - Optical Society of America), dedicated to promoting interest and research in the fields of optics, photonics, and optical communication technologies.\nThe chapter aims to cultivate technical knowledge and practical skills in areas such as laser systems, optical sensing, fiber optics, imaging, and photonic devices. By encouraging students to explore both fundamental and applied aspects of light-based technologies, the chapter provides a platform for collaborative learning and research discussions.\nThe chapter aspires to contribute to the growing global optics community by engaging students in cutting-edge research topics and encouraging innovation in light-driven technologies.`,
  core: [
    {
      name: 'Nithin',
      role: 'Chapter President',
      image: '/societies/OpticaStudentChapter/cores/nithin.webp',
      email: 'ec24i2002@iiitdm.ac.in',
      linkedin: 'https://www.linkedin.com/in/nithin-kanna-71020a373',
      year: '',
      department: '',
      roll: 'EC24I2002'
    }
  ],
  team: [
    {
      name: 'Zara Khan',
      role: 'Technical Lead',
      image: '/images/team/zara-khan.webp',
      email: 'zara.khan@iiitdm.ac.in',
      linkedin: 'https://linkedin.com/in/zarakhan',
      year: 'B.Tech 2nd Year',
      department: 'Electronics Engineering',
      roll: 'ec23b4003'
    },
    {
      name: 'Rohan Mehta',
      role: 'Research Coordinator',
      image: '/images/team/rohan-mehta.webp',
      email: 'rohan.mehta@iiitdm.ac.in',
      linkedin: 'https://linkedin.com/in/rohanmehta',
      year: 'B.Tech 2nd Year',
      department: 'Electronics Engineering',
      roll: 'ec23b4004'
    }
  ],
  links: {
    website: 'https://optica.iiitdm.ac.in',
    instagram: 'https://instagram.com/optica_iiitdm',
    github: 'https://github.com/optica-iiitdm'
  }
};

function OpticaStudentChapter() {
  return <SocietyPageTemplate {...clubData} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default OpticaStudentChapter; 
