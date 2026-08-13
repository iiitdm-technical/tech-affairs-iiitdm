// E-Cell uses ClubPageTemplate (old template) which has a slightly different prop shape.
// Core data is stored here; page.tsx adapts it for the template it uses.
import type { ClubPageData } from "@/types/club";

const data: ClubPageData = {
  name: "E-Cell",
  logo: "/societies/Ecell/logo.webp",
  introduction: `The E-Cell at IIITDM Kancheepuram is dedicated to fostering entrepreneurial spirit and innovation among students. The club provides a platform for aspiring entrepreneurs to learn, collaborate, and transform ideas into viable business ventures. Through workshops, mentorship, and networking events, E-Cell empowers students to develop essential skills in business planning, leadership, and creative problem-solving. E-Cell IIITDM reached the NEC finals at IIT Bombay and secured a Top 25 position out of 4,000 teams across India.`,
  timeline: [],
  projects: [
    {
      name: "NEC Finals at IIT Bombay",
      description: "E-Cell IIITDM secured Top 25 out of 4,000 teams across India.",
      themeColor: "#7C3AED",
    },
  ],
  gallery: [],
  core: [
    {
      name: "Deethiya Priyadharshini",
      role: "Core",
      image: "/societies/Ecell/headcores/deethiya.webp",
      email: "me24b2027@iiitdm.ac.in",
      linkedin: "",
      roll: "ME24B2027",
    },
  ],
  links: {
    website: "https://iiitdmk-ecell.vercel.app/",
    instagram: "https://www.instagram.com/ecell_iiitdm/",
    github: "#",
  },
};

export default data;
