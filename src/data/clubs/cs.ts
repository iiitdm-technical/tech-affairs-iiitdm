import type { ClubPageData } from "@/types/club";

const data: ClubPageData = {
  name: "CS Club",
  logo: "/clubs/csclub/logo.webp",
  introduction: `CS Club IIITDMK is a student-led computing community at IIITDM Kancheepuram founded in
2018, and the go-to place for anyone excited about building, breaking, debugging, and
creating cool tech. We bring together students who love solving problems, exploring new
technologies, and pushing their limits beyond the classroom.

The club operates through five wings — Competitive Programming (CP), Artificial Intelligence
(AI), PRIT (Projects, Research & Industry Talks), EDITH, and Networking. Whether it's cracking
ICPC-style problems, training ML models, building research-driven projects, or designing
real-world systems, there's something here for every kind of tech enthusiast.

What makes CS Club special is its hands-on, learn-by-doing culture. From hackathons and
coding contests to workshops, industry talks, and collaborative builds, we believe the best
way to learn is to actually build. More than just a club, we're a community where students
grow together, mentor each other, and prepare to take on real-world tech challenges with
confidence.`,
  timeline: [
    {
      year: 2025,
      event: "CODE-A-THON – September 2025",
      description: `CODE-A-THON was conducted in collaboration with the CSE Department and IEEE IIITDMK to promote competitive coding and collaborative problem-solving. The event provided students with a structured platform to test their algorithmic thinking and coding efficiency in a high-energy competitive setting.

The initiative strengthened the institute's coding culture and demonstrated effective inter-organizational collaboration on campus.`,
    },
    {
      year: 2025,
      event: "UDBHAV – Inter IIIT Hackathon",
      description: `CS Club IIITDMK coordinated institute-level participation for UDBHAV, the Inter-IIIT Hackathon hosted by IIIT Sri City, which saw participation from all IIITs across the country.

By managing registrations, team coordination, and communication, the club ensured strong representation from IIITDMK at a national-level collaborative innovation platform.`,
    },
    {
      year: 2026,
      event: "AI-ML Hackathon 2026",
      description: `AI-ML Hackathon 2026 was a two-stage competitive machine learning challenge organized by CS Club IIITDMK centred around a real-world-inspired supervised regression problem.

The 24-hour online round witnessed 100+ participants and 708 submissions, reflecting strong engagement and competitive intensity.

With a structured final presentation round and a ₹10,000 prize pool, the event highlighted the club's organizational strength and the growing AI culture within the institute.`,
    },
  ],
  projects: [
    {
      name: "ART of ARRAYS",
      image: "/clubs/csclub/events/art-of-arrays.webp",
      description: `Conducted by: CP Wing

The Art of Arrays was a beginner-friendly session designed especially for first-year students, focusing on structured and efficient approaches to solving array-based problems.

From brute force to optimal techniques like prefix sums and two pointers, the event helped students build strong foundations in Data Structures and Algorithms and competitive programming.`,
    },
    {
      name: "AI WEEK",
      image: "/clubs/csclub/events/ai-week.webp",
      description: `Conducted by: AI Wing

AI Week was a week-long technical series designed to immerse students in Artificial Intelligence and Machine Learning.

Events included:
• Chatbot Creation from Scratch – Hands-on session introducing conversational AI systems.
• Generative AI Session – Talk on generative models and real-world applications.
• EDA Contest – Data analysis challenge to derive insights from datasets.
• ML Hackathon – Competitive challenge building machine learning models.
• AI Meme Challenge – Creative event combining AI knowledge with humor.

With prizes worth ₹10,000, AI Week successfully combined learning, innovation, and competition while fostering enthusiasm for AI and ML across campus.`,
    },
    {
      name: "GATE Series 2025",
      image: "/clubs/csclub/events/gate-series.webp",
      description: `Conducted by: PRIT Wing

The GATE Series 2025 was organized to support students preparing for the GATE examination through expert-led sessions focusing on core Computer Science concepts.

The series emphasized solving GATE Previous Year Questions (PYQs), helping participants strengthen conceptual clarity and develop exam-oriented problem-solving skills.`,
    },
    {
      name: "Hardware Sessions – Arduino Series",
      image: "/clubs/csclub/events/arduino-series.webp",
      description: `Conducted by: EdITH Wing

Two hands-on Arduino workshops were conducted to introduce students to embedded systems and practical hardware development.

Starting with LED control fundamentals and progressing to PIR sensor-based projects, the sessions provided real-time exposure to building interactive hardware systems and exploring IoT applications.`,
    },
    {
      name: "Problem of the Day (POTD)",
      image: "/clubs/csclub/events/potd.webp",
      description: `A continuous coding initiative encouraging students to practice competitive programming daily through curated problems that improve algorithmic thinking and problem-solving skills.`,
    },
    {
      name: "AI TOOLBOX",
      image: "/clubs/csclub/events/ai-toolbox.webp",
      description: `A weekly educational series introducing practical AI tools and their real-world applications through simple, application-focused Instagram content designed to help students explore AI technologies easily.`,
    },
  ],
  gallery: [
    { src: "/clubs/csclub/gallery/arduino-series.webp", caption: "" },
    { src: "/clubs/csclub/gallery/ai-week.webp",        caption: "" },
    { src: "/clubs/csclub/gallery/art-of-arrays.webp",  caption: "" },
    { src: "/clubs/csclub/gallery/gate-series.webp",    caption: "" },
    { src: "/clubs/csclub/gallery/gallery1.webp",       caption: "" },
    { src: "/clubs/csclub/gallery/gallery2.webp",       caption: "" },
    { src: "/clubs/csclub/gallery/gallery3.webp",       caption: "" },
    { src: "/clubs/csclub/gallery/gallery4.webp",       caption: "" },
    { src: "/clubs/csclub/gallery/gallery5.webp",       caption: "" },
    { src: "/clubs/csclub/gallery/gallery6.webp",       caption: "" },
  ],
  core: [
    {
      name: "Dhanya Venkatesh",
      role: "Head Core",
      image: "/clubs/csclub/headcores/dhanya.webp",
      email: "me23b2010@iiitdm.ac.in",
      roll: "ME23B2010",
      linkedin: "",
    },
    {
      name: "Parth Pandey",
      role: "Tech Lead",
      image: "/clubs/csclub/headcores/parth.webp",
      email: "cs23i1064@iiitdm.ac.in",
      roll: "CS23I1064",
      linkedin: "https://www.linkedin.com/in/parth-pandey-b20932299",
    },
  ],
  links: {
    website: "https://csclub.netlify.app/",
    instagram: "https://www.instagram.com/cs.club.iiitdm/",
    github: "https://github.com/cs-iiitdm",
  },
};

export default data;
