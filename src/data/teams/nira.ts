import type { ClubPageData } from "@/types/club";

const data: ClubPageData = {
  name: "Team Nira",
  logo: "/teams/nira/logo.webp",
  introduction: `AUV SOCIETY IIITDM - We are a team of interdisciplinary undergraduate engineers working to
build autonomous underwater vehicles for various underwater robotics competitions. The team
works in the robotic domains of mechanical, electronics, and software. We aim to culminate our
theoretical knowledge and use it to fabricate underwater vehicles that can traverse the depths of
the ocean and function autonomously. AUV is a club with the vision of fostering innovation and
research in underwater robotics. Our objective is to design and develop autonomous
underwater systems capable of performing complex tasks such as navigation, object detection,
and manipulation in underwater environments.
The club provides hands-on exposure in domains like robotics, computer vision, embedded
systems, control algorithms, and mechanical design. What makes AUV stand out is its strong
interdisciplinary collaboration and consistent participation in national-level and international
robotics competitions such as SAUVC (Singapore Autonomous Underwater Vehicle Challenge)`,
  timeline: [
    {
      year: 2019,
      event: "17th Place, Singapore AUV Challenge (SAUVC)",
      description: "The team successfully participated in their first international competition with their debut vehicle, AUV V1.0. The challenge involved complex tasks in navigation, visual identification, and robotic manipulation.",
    },
    {
      year: 2020,
      event: "Participation, Singapore AUV Challenge (SAUVC)",
      description: "The society returned to the competition with their improved AUV V2.0, demonstrating enhanced autonomous capabilities.",
    },
    {
      year: 2021,
      event: "Research Paper Publication, Global OCEANS 2021",
      description: "Team members Mayank Navneet Mehta, Subash Mylraj, and Vishva Nilesh Bhate published a paper titled \"Development of AUV for SAUVC During COVID-19,\" detailing their design and testing of control and vision algorithms.",
    },
    {
      year: 2022,
      event: "Top 30, Singapore AUV Challenge (SAUVC)",
      description: "Team Shaurya competed with their vehicle \"NEMO\" (AUV V3.0), securing a spot among the top 30 teams globally.",
    },
    {
      year: 2023,
      event: "3rd Place (Worldwide), MATE ROV World Championship",
      description: "Team Nira, as the sole representative from India, achieved a podium finish by securing 3rd place globally in the Ocean Exploration Video Challenge component of the championship held in Longmont, Colorado, USA.",
    },
    {
      year: 2024,
      event: "Qualified for the onsite round in Singapore - SAUVC 2024",
      description: "Team members represented our college in an international level competition at Singapore in SAUVC 2024. Engineered the AUV Marty for this competition.",
    },
    {
      year: 2025,
      event: "5th Place, Singapore AUV Challenge (SAUVC)",
      description: "The team achieved its highest rank to date in this international competition, placing 5th out of 41 teams from 13 different countries.",
    },
    {
      year: 2026,
      event: "1st Place (Winners), 2nd Place (Runners-Up), Best Poster Presentation & Best Video Submission – AqUaVision 2026",
      description: "Team Nira and Samira achieved a major sweep at the national-level competition hosted by the IEEE OES Student Chapter at IIT Madras. The team secured four primary honors: 1st Place, 2nd Place, Best Poster Presentation, and Best Video Submission. As part of the top awards, the club received two XSENS sensors with a combined value of approximately ₹6 Lakhs.",
    },
  ],
  projects: [
    {
      name: "Custom Pub Sub architecture to remove ROS",
      description: "Lock Free Ring Buffer architecture for single host robotic systems to speed up data transmission. Development of ML Based PID Tuning for automating the tiring trial error process of PID tuning for an AUV.",
      image: "/teams/nira/logo.webp",
      technologies: ["Computer Vision", "Embedded Systems", "Control Systems", "Hydrodynamics"],
      themeColor: "#1E88E5",
    },
    {
      name: "Magnetic Kill Switch & Hydrophones",
      description: "Magnetic Kill Switch (Development Done - Used in Nebula v2, Moses). Hydrophones (For acoustic localisation). Development of ADRC controller instead of PID controller for real world use cases for an AUV.",
      image: "/teams/nira/logo.webp",
      technologies: ["Computer Vision", "OpenCV", "Deep Learning"],
      themeColor: "#43A047",
    },
    {
      name: "Robotic Arm / Manipulator",
      description: "A Bio inspired gripping mechanism.",
      image: "/teams/nira/logo.webp",
      technologies: ["Computer Vision", "OpenCV", "Deep Learning"],
      themeColor: "#43A047",
    },
  ],
  gallery: [
    { src: "/teams/nira/auv1.webp",  caption: "Team Nira AUV prototype" },
    { src: "/teams/nira/auv7.webp",  caption: "Team members working on AUV development" },
    { src: "/teams/nira/auv5.webp",  caption: "" },
    { src: "/teams/nira/auv10.webp", caption: "" },
  ],
  core: [
    {
      name: "Piyush Mishra",
      role: "Team Lead",
      image: "/teams/nira/piyush.webp",
      email: "cs24b1048@iiitdm.ac.in",
      linkedin: "https://www.linkedin.com/in/piyush-mishra-056b6a326",
      roll: "CS24B1048",
    },
  ],
  links: {
    website: "#",
    instagram: "#",
  },
};

export default data;
