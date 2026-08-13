import type { ClubPageData } from "@/types/club";

const data: ClubPageData = {
  name: "System Coding Club (SCC)",
  logo: "/clubs/Scc/logo1.webp",
  introduction: `The Systems Coding Club is a technical community at IIITDM Kancheepuram dedicated to building strong foundations in low-level programming, hardware-oriented design, and real-world system development. The club focuses on practical learning, hands-on sessions, and project-based exploration to bridge the gap between theory and implementation. Organized into three wings — Embedded Systems, MATLAB & Simulation, and Verilog & Digital Design — the club conducts technical sessions and workshops on core and advanced topics, mentors juniors by building strong conceptual and practical knowledge, and empowers students with skills in microcontrollers, FPGA-based systems, signal processing, firmware development, and RTL design.`,
  timeline: [
    { year: 2024, event: "Club Foundation", description: "The Systems Coding Club was established at IIITDM Kancheepuram to promote hardware-level programming and system design." },
    { year: 2025, event: "Embedded Systems Workshop", description: "Conducted a session on Communication Protocols covering UART, SPI, and I2C for embedded systems." },
    { year: 2025, event: "MATLAB Onramp Session", description: "Organized an introductory MATLAB session to help students get started with simulation and technical computing." },
    { year: 2025, event: "FSM Design Workshop", description: "Conducted the Finite State Machines Design Workshop with 30 participants, covering Moore and Mealy machines with hands-on Verilog HDL exercises." },
  ],
  projects: [
    {
      name: "FSM Design Workshop",
      description: "A workshop on Finite State Machines conducted on 30-12-2025, covering Moore and Mealy state machines, conversion methods, and practical implementation using Verilog HDL. 30 participants designed, simulated, and analyzed FSMs.",
      image: "/clubs/Scc/logo1.webp",
      technologies: ["Verilog HDL", "Digital Design", "FSM"],
      themeColor: "#1976D2",
    },
    {
      name: "CROC SoC Accelerator Integration",
      description: "An ongoing project by the Verilog wing focusing on enhancing the CROC SoC by designing and integrating custom hardware accelerators and peripherals. Involves end-to-end development from RTL design and verification to full RTL-to-GDSII implementation.",
      image: "/clubs/Scc/logo1.webp",
      technologies: ["Verilog", "ASIC Design", "RTL", "SoC"],
      themeColor: "#388E3C",
    },
  ],
  gallery: [
    { src: "/clubs/Scc/IMG-20250717-WA0001.webp",           caption: "Embedded systems hardware setup with microcontroller boards." },
    { src: "/clubs/Scc/IMG-20250717-WA0002.webp",           caption: "SCC team group photo after a workshop session." },
    { src: "/clubs/Scc/IMG-20250717-WA0003.webp",           caption: "Presentation on Core Security – RFID Entry systems." },
    { src: "/clubs/Scc/IMG-20250717-WA0004.webp",           caption: "Hands-on hardware debugging session." },
    { src: "/clubs/Scc/Screenshot 2026-03-02 234403.webp",  caption: "Embedded Systems – Communication Protocols session (UART)." },
    { src: "/clubs/Scc/Screenshot 2026-03-02 235900.webp",  caption: "Attendees at the Communication Protocols workshop." },
    { src: "/clubs/Scc/Screenshot 2026-03-03 001530.webp",  caption: "UART session presentation in the lecture hall." },
    { src: "/clubs/Scc/Screenshot 2026-03-03 001634.webp",  caption: "Students attending the Embedded Systems session." },
    { src: "/clubs/Scc/Screenshot 2026-03-03 001735.webp",  caption: "MATLAB Onramp – Introduction to MATLAB." },
    { src: "/clubs/Scc/Screenshot 2026-03-03 001802.webp",  caption: "MATLAB Onramp session speaker." },
    { src: "/clubs/Scc/Screenshot 2026-03-03 002146.webp",  caption: "Workshop session in the computer lab." },
    { src: "/clubs/Scc/Screenshot 2026-03-03 002211.webp",  caption: "Hands-on coding session in the lab." },
    { src: "/clubs/Scc/Screenshot 2026-03-03 002247.webp",  caption: "Technical session on digital system design." },
  ],
  core: [
    {
      name: "Lohith Chandra Gogineni",
      role: "Club Lead",
      image: "/clubs/Scc/headcores/lohith.webp",
      email: "ec24i1006@iiitdm.ac.in",
      linkedin: "",
      roll: "EC24I1006",
    },
  ],
  links: {
    instagram: "https://www.instagram.com/systemcodingclub_iiitdm/",
    github: "https://github.com/SCC-IIITDM",
  },
};

export default data;
