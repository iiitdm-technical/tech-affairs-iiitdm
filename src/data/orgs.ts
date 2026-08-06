// Canonical source of truth for all org listings.
// Used by: OurFamily.tsx, council/page.tsx, team/page.tsx, recruitments pages, etc.
// When adding / renaming an org, update ONLY this file.

export interface OrgItem {
  name: string;
  image: string;
  link: string;
}

export const clubs: OrgItem[] = [
  { name: "CS Club",            image: "/clubs/csclub/logo.webp",    link: "/clubs/cs" },
  { name: "Developers Club",    image: "/clubs/devclub/logo.png",    link: "/clubs/dev" },
  { name: "Robotics Club",      image: "/clubs/robotics/logo.webp",  link: "/clubs/robotics" },
  { name: "System Coding Club", image: "/clubs/Scc/logo1.webp",      link: "/clubs/scc" },
  { name: "Cybersecurity Club", image: "/clubs/cybersecurity/logo.jpg", link: "/clubs/cybersecurity" },
];

export const teams: OrgItem[] = [
  { name: "Team Nira (AUV)",    image: "/teams/nira/logo.webp",   link: "/teams/nira" },
  { name: "Team Astra",         image: "/teams/astra/logo.webp",  link: "/teams/astra" },
  { name: "Revolt Racers",      image: "/teams/revolt/logo.webp", link: "/teams/revolt" },
  { name: "Team TAD",           image: "/teams/tad/logo.webp",    link: "/teams/tad" },
  { name: "Team Shunya (MaRS)", image: "/teams/mars/logo.webp",   link: "/teams/shunya" },
];

export const societies: OrgItem[] = [
  { name: "E-Cell",                image: "/societies/Ecell/logo.webp",                    link: "/societies/ecell" },
  { name: "IEEE",                  image: "/societies/IEEE/logo.png",                      link: "/societies/ieee" },
  { name: "Optica Student Chapter",image: "/societies/OpticaStudentChapter/logo.webp",     link: "/societies/optica" },
  { name: "ASME Student Section",  image: "/societies/ASMEStudentSection/logo.webp",       link: "/societies/asme" },
];

export const communities: OrgItem[] = [
  { name: "Game Developers",  image: "/communities/gamedevelopers/logo.png",  link: "/communities/gamedevelopers" },
];
