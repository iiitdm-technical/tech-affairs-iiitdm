/**
 * Seed script — run once to populate the DB with all static data.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed.ts
 *
 * Re-running is safe: it upserts / skips existing rows.
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import {
  Achievements,
  Orgs,
  TechAffairsTeam,
  Clubs,
  OrgAdmins,
  User_roles,
} from '../src/db/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client });

// ---------------------------------------------------------------------------
// 1. ACHIEVEMENTS  (46 entries from src/data/achievements.ts)
// ---------------------------------------------------------------------------

const ACHIEVEMENT_SLUG_MAP: Record<string, string> = {
  'AUV Society':         'nira',
  'Mars Club':           'shunya',
  'TAD':                 'tad',
  'SAE Collegiate Club': 'revolt',
  'IEEE Student Branch': 'ieee',
  'Team Astra':          'astra',
  'E-Cell':              'ecell',
};

const staticAchievements = [
  { title: 'SAUVC 2019',                                          description: 'Secured 17th Position internationally',                                                                                       year: '2019', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'Research Paper at OCEANS 2021',                       description: 'Development of AUV for SAUVC During COVID-19',                                                                                year: '2021', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'VAX 2022',                                            description: 'One among Top 30 teams internationally',                                                                                      year: '2022', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'Research Paper at OCEANS 2022',                       description: 'Design and Performance Analysis of Bio-Inspired Remotely Operated Robot',                                                     year: '2022', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'Research Paper at 2022 IEEE OES AUV SYMPOSIUM',       description: 'Mechanical Design, Analysis and Development of an AUV for SAUVC',                                                            year: '2022', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'MATE ROV 2022',                                       description: 'Fabricated a ROV & got selected to represent INDIA in MATE 2022 in USA',                                                     year: '2022', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'SAUVC 2022',                                          description: 'Participated in SAUVC during September 2022.',                                                                                year: '2022', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'MATE ROV OCEANS EXPLORER CHALLENGE 2023',             description: 'Fabricated a hybrid ROV-AUV Vehicle and got selected to represent INDIA in MATE 2023 Placed 3rd worldwide in Oceans Explorer Challenge', year: '2023', club: 'AUV Society', logo: '/teams/nira/logo.webp' },
  { title: 'AQUA QUEST',                                          description: 'Hosting a Nationwide ROV competition on Feb 2024',                                                                            year: '2024', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'Research Paper at OCEANS 2022 (Coral Reef)',          description: 'Analysis of Underwater Coral Reef Health Using Neural Networks',                                                              year: '2022', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'Research Paper at OCEANS 2024',                       description: 'Optimisation of Visual SLAM for Underwater Robotics using OAK-D Smart Camera',                                               year: '2024', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'SAUVC 2024',                                          description: 'Making the vehicle completely autonomous. Implementing novel idea for grasping objects.',                                     year: '2024', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'IIT BOMBAY 2025',                                     description: 'Secured 1st place in the International AUV Challenge, organised by IIT Bombay',                                              year: '2025', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'IIT MADRAS 2025',                                     description: "Secured 2nd Place in AquaVision '2025 hosted by IIT Madras.",                                                                year: '2025', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'SAUVC 2025',                                          description: 'Secured 5th place globally in the Singapore AUV Challenge 2025',                                                             year: '2025', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'European Rover Challenge 2023 (Remote)',              description: '6th place internationally',                                                                                                   year: '2023', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'European Rover Challenge 2023 (Onsite)',              description: '21st place internationally',                                                                                                  year: '2023', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'International Rover Challenge 2024 (Onsite)',         description: '21st place internationally',                                                                                                  year: '2024', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'Australian Rover Challenge 2024 (Documentation)',     description: '5th place internationally',                                                                                                   year: '2024', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'Australian Rover Challenge 2024 (Onsite)',            description: '12th place internationally',                                                                                                  year: '2024', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'ISRO Robotics Challenge 2024 (Onsite)',               description: '6th place internationally',                                                                                                   year: '2024', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'International Rover Challenge 2025 (Onsite)',         description: '16th place internationally',                                                                                                  year: '2025', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'ERC 2023 (Remote) Proposal Round',                    description: '2nd place internationally',                                                                                                   year: '2023', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'IIT Bombay Competition 2024',                         description: 'Two teams in the top 50 out of 500, clearing the abstract round and flying RC planes with payload.',                         year: '2024', club: 'TAD',                 logo: '/teams/tad/logo.webp'        },
  { title: 'IIT Madras – Boeing National Aeromodelling Competition 2024', description: 'Six teams cleared the abstract round, gaining experience in design thinking and teamwork.',                          year: '2024', club: 'TAD',                 logo: '/teams/tad/logo.webp'        },
  { title: 'IAC-Conference 2024 by ASoI',                         description: 'Won Runner-up for designing a docking mechanism to charge electric-hybrid UAVs.',                                            year: '2024', club: 'TAD',                 logo: '/teams/tad/logo.webp'        },
  { title: 'SAE eBaja 2025 - Phase 1',                            description: 'Achieved All India Rank of 16 out of 86 teams, standing 4th in Tamil Nadu.',                                                 year: '2025', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp'     },
  { title: 'SAE eBaja 2025 - Phase 2 (Virtuals)',                 description: 'Secured strong ranks: Design (25th), Cost (20th), Sustainability (7th), and IPG Event (5th).',                              year: '2025', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp'     },
  { title: 'SAE eBaja 2025 - Overall',                            description: 'Finished with an overall All-India Rank of 35 out of 86 teams.',                                                             year: '2025', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp'     },
  { title: 'SAE mBaja 2025 - Phase 1',                            description: 'Achieved an overall All India Rank of 9 and 2nd in Tamil Nadu.',                                                             year: '2025', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp'     },
  { title: 'SAE mBaja 2025 - Phase 2',                            description: 'Secured top ranks in multiple categories: Design (AIR 7), Cost (AIR 7), and Sustainability (AIR 10).',                     year: '2025', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp'     },
  { title: 'SAE mBaja 2025 - Phase 3 (Statics)',                  description: 'Achieved top final ranks in key static events: Design (AIR 7), Cost (AIR 5), and CAE (AIR 5).',                            year: '2025', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp'     },
  { title: 'SAE mBaja 2025 - Overall',                            description: 'Secured an impressive overall All India Rank (AIR) of 18.',                                                                   year: '2025', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp'     },
  { title: 'AMUROVc 4.0',                                         description: 'Second Runner Up',                                                                                                            year: '2026', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'AquaVision 2.0 IIT Madras',                           description: 'Winner, Runner-up, Best Poster and Best Video Submission. Won sensors worth ~₹6L',                                          year: '2026', club: 'AUV Society',         logo: '/teams/nira/logo.webp'       },
  { title: 'International Rover Challenge',                       description: 'Global Rank 9',                                                                                                               year: '2026', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'International Space Drone Challenge',                 description: 'Global Rank 10',                                                                                                              year: '2026', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'European Rover Challenge Remote Edition',             description: '4th place globally',                                                                                                          year: '2026', club: 'Mars Club',           logo: '/teams/mars/logo.webp'       },
  { title: 'IEEE CASS Student Design Competition',                description: '2nd place in IEEE Madras Section, Top 20 teams in India',                                                                     year: '2026', club: 'IEEE Student Branch', logo: '/societies/IEEE/logo.webp'   },
  { title: 'IEEE Xtreme 2025',                                    description: '24 hour global hackathon, global rank under 1000',                                                                            year: '2025', club: 'IEEE Student Branch', logo: '/societies/IEEE/logo.webp'   },
  { title: 'ISRO IRoC-U 2025',                                    description: 'Top finalist nationwide out of 510+ teams and advanced to field round at ISRO Bengaluru',                                    year: '2025', club: 'Team Astra',          logo: '/teams/astra/logo.webp'      },
  { title: 'National Space Day Award Ceremony',                   description: 'Invited to National Space Day awards at Bharat Mandapam, New Delhi',                                                          year: '2025', club: 'Team Astra',          logo: '/teams/astra/logo.webp'      },
  { title: 'SAE AeroTHON 2025',                                   description: 'AIR 8 in design phase, Top 25 nationally',                                                                                   year: '2025', club: 'Team Astra',          logo: '/teams/astra/logo.webp'      },
  { title: 'Caterpillar Autonomy Challenge Shaastra 2026',        description: 'Won Judges Innovation Award with ₹30,000 prize',                                                                             year: '2026', club: 'Team Astra',          logo: '/teams/astra/logo.webp'      },
  { title: 'SAE e-BAJA 2025–26',                                  description: 'Team Revolt Racers competed in SAE e-BAJA 2025–26 (Indore). Achieved AIR 36/95 | CFTI Rank 2 | Tamil Nadu Rank 6. Completed 7 endurance laps, improving from 5 last year.', year: '2026', club: 'SAE Collegiate Club', logo: '/teams/revolt/logo.webp' },
  { title: 'NEC Finals at IIT Bombay',                            description: 'E-Cell IIITDM secured Top 25 out of 4,000 teams across India.',                                                              year: '2026', club: 'E-Cell',              logo: '/societies/Ecell/logo.webp'  },
];

// ---------------------------------------------------------------------------
// 2. ORGS  (clubs / teams / societies / communities from src/data/orgs.ts)
// ---------------------------------------------------------------------------

const staticOrgs = [
  // Clubs
  { name: 'CS Club',            image: '/clubs/csclub/logo.webp',                    link: '/clubs/cs',                  category: 'club',      sort_order: 1 },
  { name: 'Developers Club',    image: '/clubs/devclub/logo.png',                    link: '/clubs/dev',                 category: 'club',      sort_order: 2 },
  { name: 'Robotics Club',      image: '/clubs/robotics/logo.webp',                  link: '/clubs/robotics',            category: 'club',      sort_order: 3 },
  { name: 'System Coding Club', image: '/clubs/Scc/logo1.webp',                      link: '/clubs/scc',                 category: 'club',      sort_order: 4 },
  { name: 'Cybersecurity Club', image: '/clubs/cybersecurity/logo.jpg',              link: '/clubs/cybersecurity',       category: 'club',      sort_order: 5 },
  // Teams
  { name: 'Team Nira (AUV)',    image: '/teams/nira/logo.webp',                      link: '/teams/nira',                category: 'team',      sort_order: 1 },
  { name: 'Team Astra',         image: '/teams/astra/logo.webp',                     link: '/teams/astra',               category: 'team',      sort_order: 2 },
  { name: 'Revolt Racers',      image: '/teams/revolt/logo.webp',                    link: '/teams/revolt',              category: 'team',      sort_order: 3 },
  { name: 'Team TAD',           image: '/teams/tad/logo.webp',                       link: '/teams/tad',                 category: 'team',      sort_order: 4 },
  { name: 'Team Shunya (MaRS)', image: '/teams/mars/logo.webp',                      link: '/teams/shunya',              category: 'team',      sort_order: 5 },
  // Societies
  { name: 'E-Cell',                   image: '/societies/Ecell/logo.webp',                link: '/societies/ecell',     category: 'society',   sort_order: 1 },
  { name: 'IEEE',                     image: '/societies/IEEE/logo.png',                  link: '/societies/ieee',      category: 'society',   sort_order: 2 },
  { name: 'Optica Student Chapter',   image: '/societies/OpticaStudentChapter/logo.webp', link: '/societies/optica',    category: 'society',   sort_order: 3 },
  { name: 'ASME Student Section',     image: '/societies/ASMEStudentSection/logo.webp',   link: '/societies/asme',      category: 'society',   sort_order: 4 },
  // Communities
  { name: 'Cybersecurity',     image: '/communities/Cybersecurity/logo.webp',         link: '/clubs/cybersecurity',       category: 'community', sort_order: 1 },
  { name: 'Game Developers',   image: '/communities/gamedevelopers/logo.png',         link: '/communities/gamedevelopers', category: 'community', sort_order: 2 },
];

// ---------------------------------------------------------------------------
// 3. TECH AFFAIRS TEAM
// ---------------------------------------------------------------------------

const staticTeam = [
  // SAC
  { type: 'sac', name: 'P Kaarthick Natesh', position: 'Technical Affairs Secretary',      image: '/technical-affairs-team/sac/PKaarthickNatesh.webp', email: 'ec22b1004@iiitdm.ac.in', linkedin: '', url: '', path: '', sort_order: 1 },
  { type: 'sac', name: 'Ranveer Gautam',      position: 'Technical Affairs Joint Secretary', image: '/technical-affairs-team/sac/RanveerGautam.webp',    email: 'me23b2031@iiitdm.ac.in', linkedin: '', url: '', path: '', sort_order: 2 },
  // Faculty
  { type: 'faculty', name: 'Prof. M D Selvaraj',        position: 'Dean DII',                   image: '/facultyheads/selvaraj.webp',    email: '', linkedin: '', url: '', path: '', sort_order: 1 },
  { type: 'faculty', name: 'Dr. Vikash Kumar',           position: 'PIC - Technical Affairs',   image: '/facultyheads/vikash.webp',      email: '', linkedin: '', url: '', path: '', sort_order: 2 },
  { type: 'faculty', name: 'Dr. Bhukya Krishna Priya',  position: 'PIC - Technical Affairs',   image: '/facultyheads/krishnapriya.webp', email: '', linkedin: '', url: '', path: '', sort_order: 3 },
  // Social Media (name = platform label, url = link)
  { type: 'social', name: 'Instagram', position: '', image: '', email: '', linkedin: '', url: 'https://www.instagram.com/iiitdm.technical/', path: '', sort_order: 1 },
  { type: 'social', name: 'LinkedIn',  position: '', image: '', email: '', linkedin: '', url: 'https://www.linkedin.com/company/technical-affairs-iiitdm/', path: '', sort_order: 2 },
  { type: 'social', name: 'YouTube',   position: '', image: '', email: '', linkedin: '', url: 'https://www.youtube.com/@iiitdm.technical', path: '', sort_order: 3 },
  // Core Teams (name = label, path = link)
  { type: 'core_team', name: 'Management',          position: '', image: '', email: '', linkedin: '', url: '', path: '/team/management',          sort_order: 1 },
  { type: 'core_team', name: 'Tech Development',    position: '', image: '', email: '', linkedin: '', url: '', path: '/team/tech-development',    sort_order: 2 },
  { type: 'core_team', name: 'Innovation',          position: '', image: '', email: '', linkedin: '', url: '', path: '/team/innovation',          sort_order: 3 },
  { type: 'core_team', name: 'Social Outreach',     position: '', image: '', email: '', linkedin: '', url: '', path: '/team/social-outreach',     sort_order: 4 },
  { type: 'core_team', name: 'Media and Marketing', position: '', image: '', email: '', linkedin: '', url: '', path: '/team/media-and-marketing', sort_order: 5 },
];

// ---------------------------------------------------------------------------
// 4. ORG AUTHORIZED EMAILS (for auth/roles)
//    These seed the Clubs table's authorized_email + OrgAdmins + User_roles
// ---------------------------------------------------------------------------

const orgEmails: { name: string; email: string; org_slug: string; image: string }[] = [
  { name: 'CS Club',            email: 'csclub@iiitdm.ac.in',        org_slug: 'clubs/cs',                   image: '/clubs/csclub/logo.webp' },
  { name: 'Developers Club',    email: 'devclub@iiitdm.ac.in',       org_slug: 'clubs/dev',                  image: '/clubs/devclub/logo.png' },
  { name: 'System Coding Club', email: 'scc@iiitdm.ac.in',           org_slug: 'clubs/scc',                  image: '/clubs/Scc/logo1.webp' },
  { name: 'Team Nira (AUV)',    email: 'auv.society@iiitdm.ac.in',   org_slug: 'teams/nira',                 image: '/teams/nira/logo.webp' },
  { name: 'Team Shunya (MaRS)', email: 'mars@iiitdm.ac.in',          org_slug: 'teams/shunya',               image: '/teams/mars/logo.webp' },
  { name: 'E-Cell',             email: 'ecell@iiitdm.ac.in',         org_slug: 'societies/ecell',            image: '/societies/ecell/logo.webp' },
  { name: 'Team TAD',           email: 'tad@iiitdm.ac.in',           org_slug: 'teams/tad',                  image: '/teams/tad/logo.webp' },
  { name: 'Team Astra',         email: 'astra@iiitdm.ac.in',         org_slug: 'teams/astra',                image: '/teams/astra/logo.webp' },
  { name: 'Revolt Racers',      email: 'revoltracers@iiitdm.ac.in',  org_slug: 'teams/revolt',               image: '/teams/revolt/logo.webp' },
  { name: 'Optica',             email: 'optica@iiitdm.ac.in',        org_slug: 'societies/optica',           image: '/societies/optica/logo.webp' },
  { name: 'IEEE SB',            email: 'ieeesb@iiitdm.ac.in',        org_slug: 'societies/ieee',             image: '/societies/ieee/logo.webp' },
  { name: 'Robotics Club',      email: 'robotics@iiitdm.ac.in',      org_slug: 'clubs/robotics',             image: '/clubs/robotics/logo.webp' },
  { name: 'ASME',               email: 'asme@iiitdm.ac.in',          org_slug: 'societies/asme',             image: '/societies/ASMEStudentSection/logo.webp' },
];

// ---------------------------------------------------------------------------
// RUNNER
// ---------------------------------------------------------------------------

async function seed() {
  console.log('▶ Seeding achievements…');
  let achInserted = 0;
  for (const a of staticAchievements) {
    const orgSlug = ACHIEVEMENT_SLUG_MAP[a.club] ?? a.club.toLowerCase().replace(/\s+/g, '-');
    // Skip if already exists (match on title + year)
    const existing = await db
      .execute(sql`SELECT id FROM achievements WHERE title = ${a.title} AND year = ${a.year} LIMIT 1`);
    if ((existing as unknown[]).length > 0) continue;
    await db.insert(Achievements).values({
      org_slug: orgSlug,
      title: a.title,
      description: a.description,
      year: a.year,
      proof_url: '',
      logo: a.logo,
    });
    achInserted++;
  }
  console.log(`   inserted ${achInserted} / ${staticAchievements.length} achievements`);

  console.log('▶ Seeding orgs…');
  let orgInserted = 0;
  for (const o of staticOrgs) {
    const existing = await db
      .execute(sql`SELECT id FROM orgs WHERE link = ${o.link} LIMIT 1`);
    if ((existing as unknown[]).length > 0) continue;
    await db.insert(Orgs).values(o);
    orgInserted++;
  }
  console.log(`   inserted ${orgInserted} / ${staticOrgs.length} orgs`);

  console.log('▶ Seeding tech_affairs_team…');
  let teamInserted = 0;
  for (const t of staticTeam) {
    const existing = await db
      .execute(sql`SELECT id FROM tech_affairs_team WHERE type = ${t.type} AND name = ${t.name} LIMIT 1`);
    if ((existing as unknown[]).length > 0) continue;
    await db.insert(TechAffairsTeam).values(t);
    teamInserted++;
  }
  console.log(`   inserted ${teamInserted} / ${staticTeam.length} team rows`);

  console.log('▶ Seeding org emails (Clubs / OrgAdmins / User_roles)…');
  let emailInserted = 0;
  for (const o of orgEmails) {
    // Upsert Clubs row
    const existing = await db
      .execute(sql`SELECT club_id FROM clubs WHERE org_slug = ${o.org_slug} LIMIT 1`);
    if ((existing as unknown[]).length === 0) {
      await db.insert(Clubs).values({
        name: o.name,
        iconUrl: o.image,
        authorized_email: o.email,
        org_slug: o.org_slug,
      });
    } else {
      await db.execute(sql`
        UPDATE clubs SET authorized_email = ${o.email} WHERE org_slug = ${o.org_slug}
      `);
    }
    // Upsert OrgAdmins
    const oa = await db
      .execute(sql`SELECT id FROM org_admins WHERE email = ${o.email} AND org_slug = ${o.org_slug} LIMIT 1`);
    if ((oa as unknown[]).length === 0) {
      await db.insert(OrgAdmins).values({ email: o.email, org_slug: o.org_slug });
    }
    // Upsert User_roles → 'O'
    await db
      .insert(User_roles)
      .values({ email: o.email, role: 'O' })
      .onConflictDoUpdate({ target: User_roles.email, set: { role: 'O' } });
    emailInserted++;
  }
  console.log(`   processed ${emailInserted} org emails`);

  console.log('✅ Seed complete.');
  await client.end();
}

seed().catch((err) => { console.error(err); process.exit(1); });
