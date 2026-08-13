import type { ClubPageData } from "@/types/club";

const data: ClubPageData = {
  name: "Team Shunya",
  logo: "/teams/mars/logo.webp",
  introduction: `The MaRS (Mars Rover Students) Club, founded in 2020, is a multidisciplinary student organization aimed at designing, building, and testing autonomous rovers and robotic systems that can operate in extreme terrains. With a strong focus on research, innovation, and real-world application, the club provides students with hands-on experience in mechanical design, electronics, software development, and systems integration.
Our mission is to bridge the gap between academic learning and real-world industry challenges, fostering innovation and equipping students to excel in global competitions.`,
  timeline: [
    { year: 2023, event: "European Rover Challenge",            description: "6th place (Remote) and 21st place (Onsite) internationally." },
    { year: 2023, event: "European Rover Challenge Proposal Round", description: "2nd place internationally (Remote)." },
    { year: 2024, event: "International Rover Challenge",       description: "21st place internationally (Onsite)." },
    { year: 2024, event: "Australian Rover Challenge",          description: "5th place (Documentation) and 12th place (Onsite) internationally." },
    { year: 2024, event: "ISRO Robotics Challenge (IRoC)",      description: "6th place internationally (Onsite), winning a prize money of ₹2 Lakhs." },
    {
      year: 2024,
      event: "National Space Day Recognition",
      description: `The team was invited to Bharat Mandapam, Delhi by ISRO where they presented their rover to the Hon'ble President of India, Smt. Droupadi Murmu.`,
    },
    { year: 2025, event: "International Rover Challenge",       description: "16th place internationally (Onsite)." },
  ],
  projects: [
    {
      name: "MazeRover",
      description: "Autonomous obstacle navigation challenge (50 teams)",
      image: "/teams/mars/m1.webp",
      technologies: ["Robotics", "Computer Vision", "Autonomous Navigation"],
      themeColor: "#1E88E5",
    },
    {
      name: "RoboKage",
      description: "Manual and autonomous control challenges (91 Teams)",
      image: "/teams/mars/m2.webp",
      technologies: ["Mechanical Design", "Embedded Systems", "Control Systems"],
      themeColor: "#43A047",
    },
    {
      name: "StarTrek Rally",
      description: "Simulation-based rover design sprint (27 teams)",
      image: "/teams/mars/m3.webp",
      technologies: ["Sensors", "Embedded Systems", "Data Processing"],
      themeColor: "#FB8C00",
    },
  ],
  gallery: [
    { src: "/teams/mars/rover1.webp", caption: "Team Shunya Rover Prototype" },
    { src: "/teams/mars/rover2.webp", caption: "Team working on rover assembly" },
    { src: "/teams/mars/rover3.webp", caption: "Rover testing session" },
    { src: "/teams/mars/rover4.webp", caption: "Competition preparation" },
  ],
  core: [
    {
      name: "Sandheep Rahul V",
      role: "Team Lead",
      image: "/teams/mars/sandheep.webp",
      email: "me24b2028@iiitdm.ac.in",
      linkedin: "https://www.linkedin.com/in/sandheep-rahul-171159348",
      roll: "ME24B2028",
    },
    {
      name: "Avinash Acharya",
      role: "Co-Lead / Technical Lead",
      image: "/teams/mars/avinash.webp",
      email: "me24b1060@iiitdm.ac.in",
      linkedin: "https://www.linkedin.com/in/avinash-acharya-8557ab2ba",
      roll: "ME24B1060",
    },
  ],
  links: {
    website: "#",
    instagram: "#",
  },
};

export default data;
