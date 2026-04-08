/**
 * Seeds the team_members table from static page data.
 * Run: npx tsx scripts/seed-team-members.ts
 *
 * Prerequisite: create the table first by running migrate or the SQL below:
 *   CREATE TABLE IF NOT EXISTS team_members (
 *     id SERIAL PRIMARY KEY,
 *     team_slug VARCHAR(50) NOT NULL,
 *     sub_role VARCHAR(20) NOT NULL DEFAULT 'coordinator',
 *     name VARCHAR NOT NULL,
 *     roll VARCHAR(20) DEFAULT '',
 *     email TEXT DEFAULT '',
 *     linkedin TEXT DEFAULT '',
 *     image TEXT DEFAULT '',
 *     sort_order INTEGER NOT NULL DEFAULT 0,
 *     active CHAR(1) NOT NULL DEFAULT 'Y'
 *   );
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { TeamMembers } from '../src/db/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const seed = [
  // ── management ──────────────────────────────────────────────────────────────
  { team_slug: 'management', sub_role: 'core', name: 'S M Jawhra', roll: 'CS23B1053', email: 'cs23b1053@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/s-m-jawhra-2150902b7', image: '/technical-affairs-team/management/cores/SMJawhra.webp', sort_order: 1 },
  { team_slug: 'management', sub_role: 'core', name: 'Dharun Thota', roll: 'CS22B1083', email: 'cs22b1083@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/dharun-thota-742915264/', image: '/technical-affairs-team/management/cores/DharunThota.webp', sort_order: 2 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'G S Raghava Ram', roll: 'CS24I1005', email: 'cs24i1005@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/g-sangeeth-raghava-ram-a87431323', image: '/technical-affairs-team/management/coordinators/CS24I1005.webp', sort_order: 1 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'Roshini', roll: 'CS24B1020', email: 'cs24b1020@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/roshini', image: '/technical-affairs-team/management/coordinators/CS24B1020.webp', sort_order: 2 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'Nithin M', roll: 'EC24B1016', email: 'ec24b1016@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/nithin-satya-sai-ram-maddala-59078431b', image: '/technical-affairs-team/management/coordinators/EC24B1016.webp', sort_order: 3 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'MONISH KUMAR R', roll: 'EC24B1051', email: 'ec24b1051@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/monish-kumar-r01', image: '/technical-affairs-team/management/coordinators/EC24B1051.webp', sort_order: 4 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'Adithya Ajay', roll: 'EC24B1099', email: 'ec24b1099@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/adithya-ajay-2b92aa370/', image: '/technical-affairs-team/management/coordinators/EC24B1099.webp', sort_order: 5 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'Gautam Devaraj', roll: 'EC24B1039', email: 'ec24b1039@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/gautam-devaraj-0332b7370/', image: '/technical-affairs-team/management/coordinators/EC24B1039.webp', sort_order: 6 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'Suranjana Mary', roll: 'ME24B1016', email: 'me24b1016@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/suranjana-mary-12646736a', image: '/technical-affairs-team/management/coordinators/ME24B1016.webp', sort_order: 7 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'Keerthan S', roll: 'ME24B1006', email: 'me24b1006@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/keerthan-santha-kumar-428539304', image: '/technical-affairs-team/management/coordinators/ME24B1006.webp', sort_order: 8 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'Bhavana sri', roll: 'CS24I1034', email: 'cs24i1034@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/bhavana-sri-28233836a', image: '/technical-affairs-team/management/coordinators/CS24I1034.webp', sort_order: 9 },
  { team_slug: 'management', sub_role: 'coordinator', name: 'S Yagnesh', roll: 'EC24B1103', email: 'ec24b1103@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/s-yagnesh-529112324', image: '/technical-affairs-team/management/coordinators/EC24B1103.webp', sort_order: 10 },

  // ── innovation ───────────────────────────────────────────────────────────────
  { team_slug: 'innovation', sub_role: 'core', name: 'SHREEPAL', roll: 'EC23B1107', email: 'ec23b1107@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/shreepal29', image: '/technical-affairs-team/innovation/cores/Shreepal.webp', sort_order: 1 },
  { team_slug: 'innovation', sub_role: 'coordinator', name: 'M. AKSHARA', roll: 'EC24B1127', email: 'ec24b1127@iiitdm.ac.in', linkedin: 'https://linkedin.com/in/akshara-muralikumar-0366b431b', image: '/technical-affairs-team/innovation/coordinators/EC24B1127.webp', sort_order: 1 },
  { team_slug: 'innovation', sub_role: 'coordinator', name: 'Savinay.k', roll: 'EC24B1065', email: 'ec24b1065@iiitdm.ac.in', linkedin: '', image: '/technical-affairs-team/innovation/coordinators/EC24B1065.webp', sort_order: 2 },
  { team_slug: 'innovation', sub_role: 'coordinator', name: 'Lohith Chandra', roll: 'EC24I1006', email: 'ec24i1006@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/lohith-chandra-gogineni-4a2657370', image: '/technical-affairs-team/innovation/coordinators/EC24I1006.webp', sort_order: 3 },
  { team_slug: 'innovation', sub_role: 'coordinator', name: 'G.Gouthami', roll: 'CS24B1041', email: 'cs24b1041@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/gouthami-gogineni-bb340b370', image: '/technical-affairs-team/innovation/coordinators/CS24B1041.webp', sort_order: 4 },

  // ── media-and-marketing ──────────────────────────────────────────────────────
  { team_slug: 'media-and-marketing', sub_role: 'core', name: 'Satyam Kumar Pandey', roll: 'EC23B1103', email: 'ec23b1103@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/satyam-pandey-1a10442a6', image: '/technical-affairs-team/media-and-marketing/cores/SatyamKumarPandey.webp', sort_order: 1 },
  { team_slug: 'media-and-marketing', sub_role: 'jt-core', name: 'P. Swaminatha', roll: 'EC23B1091', email: 'ec23b1091@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/putcha-swaminatha-a707b92a3/', image: '/technical-affairs-team/media-and-marketing/jtcores/PSwaminatha.webp', sort_order: 1 },
  { team_slug: 'media-and-marketing', sub_role: 'jt-core', name: 'Parth Pandey', roll: 'CS23I1064', email: 'cs23i1064@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/parth-pandey-b20932299/', image: '/technical-affairs-team/media-and-marketing/jtcores/ParthPandey.webp', sort_order: 2 },
  { team_slug: 'media-and-marketing', sub_role: 'jt-core', name: 'Akash Patel', roll: 'CS23I1055', email: 'cs23i1055@iiitdm.ac.in', linkedin: 'https://linkedin.com/in/whoakashpatel', image: '/technical-affairs-team/media-and-marketing/jtcores/AkashPatel.webp', sort_order: 3 },
  { team_slug: 'media-and-marketing', sub_role: 'coordinator', name: 'PUTCHA SWAMINATHA', roll: 'EC23B1091', email: 'ec23b1091@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/putcha-swaminatha-a707b92a3/', image: '/technical-affairs-team/media-and-marketing/coordinators/EC23B1091.webp', sort_order: 1 },
  { team_slug: 'media-and-marketing', sub_role: 'coordinator', name: 'P Sri Charan Reddy', roll: 'ME24B1071', email: 'me24b1071@iiitdm.ac.in', linkedin: '', image: '/technical-affairs-team/media-and-marketing/coordinators/ME24B1071.webp', sort_order: 2 },
  { team_slug: 'media-and-marketing', sub_role: 'coordinator', name: 'P Vinay Kumar', roll: 'CS24I1028', email: 'cs24i1028@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/vinay-kumar-959891366', image: '/technical-affairs-team/media-and-marketing/coordinators/CS24I1028.webp', sort_order: 3 },
  { team_slug: 'media-and-marketing', sub_role: 'coordinator', name: 'Jeevani Yalamanchili', roll: 'CS24B1023', email: 'cs24b1023@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/jeevani-yalamanchili-b47aa536b', image: '/technical-affairs-team/media-and-marketing/coordinators/CS24B1023.webp', sort_order: 4 },
  { team_slug: 'media-and-marketing', sub_role: 'coordinator', name: 'Pranav', roll: 'ME24B1052', email: 'me24b1052@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/pranav-b-5b772531b', image: '/technical-affairs-team/media-and-marketing/coordinators/ME24B1052.webp', sort_order: 5 },
  { team_slug: 'media-and-marketing', sub_role: 'coordinator', name: 'Sharvesh Vikhranth H', roll: 'ME23B1036', email: 'me23b1036@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/sharvesh-vikhranth-h-375ba72ba', image: '/technical-affairs-team/media-and-marketing/coordinators/ME23B1036.webp', sort_order: 6 },

  // ── social-outreach ──────────────────────────────────────────────────────────
  { team_slug: 'social-outreach', sub_role: 'core', name: 'Omkar Anand Iyer', roll: 'EC23B1075', email: 'ec23b1075@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/omkar-anand-iyer', image: '/technical-affairs-team/social-outreach/cores/OmkarAnandIyer.webp', sort_order: 1 },
  { team_slug: 'social-outreach', sub_role: 'coordinator', name: 'Nihaal Sekhar', roll: 'ME24B1062', email: 'me24b1062@iiitdm.ac.in', linkedin: '', image: '/technical-affairs-team/social-outreach/coordinators/ME24B1062.webp', sort_order: 1 },
  { team_slug: 'social-outreach', sub_role: 'coordinator', name: 'Vaishika S A', roll: 'EC24B1003', email: 'ec24b1003@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/vaishika-sathish-0a8635302', image: '/technical-affairs-team/social-outreach/coordinators/EC24B1003.webp', sort_order: 2 },
  { team_slug: 'social-outreach', sub_role: 'coordinator', name: 'Vinay Sharma', roll: 'ME24B2055', email: 'me24b2055@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/vinay-sharma-762308329', image: '/technical-affairs-team/social-outreach/coordinators/ME24B2055.webp', sort_order: 3 },
  { team_slug: 'social-outreach', sub_role: 'coordinator', name: 'Srinivasan', roll: 'ME24I1015', email: 'me24i1015@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/srinivasan-s-a5a679359', image: '/technical-affairs-team/social-outreach/coordinators/ME24I1015.webp', sort_order: 4 },

  // ── tech-development ─────────────────────────────────────────────────────────
  { team_slug: 'tech-development', sub_role: 'core', name: 'Adithya Bharadwaj', roll: 'CS22B1040', email: 'cs22b1040@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/adithya-bharadwaj', image: '/technical-affairs-team/tech-development/cores/adithya.webp', sort_order: 1 },
  { team_slug: 'tech-development', sub_role: 'core', name: 'Avula Varshini', roll: 'CS23B1015', email: 'cs23b1015@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/varshini-avula', image: '/technical-affairs-team/tech-development/cores/AVarshini.webp', sort_order: 2 },
  { team_slug: 'tech-development', sub_role: 'coordinator', name: 'Thatipalli Santhoshini', roll: 'CS24I1013', email: 'cs24i1013@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/santhoshini-thatipalli-265497306', image: '/technical-affairs-team/tech-development/coordinators/CS24I1013.webp', sort_order: 1 },
  { team_slug: 'tech-development', sub_role: 'coordinator', name: 'Yashvanth S', roll: 'CS24I1029', email: 'cs24i1029@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/yashvanths/', image: '/technical-affairs-team/tech-development/coordinators/CS24I1029.webp', sort_order: 2 },
  { team_slug: 'tech-development', sub_role: 'coordinator', name: 'D Pritika', roll: 'CS24I1040', email: 'cs24i1040@iiitdm.ac.in', linkedin: 'https://www.linkedin.com/in/pritika-desinghu-aaa9a9363/', image: '/technical-affairs-team/tech-development/coordinators/CS24I1040.webp', sort_order: 3 },
  { team_slug: 'tech-development', sub_role: 'coordinator', name: 'Narendhar T S', roll: 'EC24B1053', email: 'ec24b1053@iiitdm.ac.in', linkedin: 'https://linkedin.com/in/narendharts', image: '/technical-affairs-team/tech-development/coordinators/EC24B1053.webp', sort_order: 4 },
  { team_slug: 'tech-development', sub_role: 'coordinator', name: 'Harshitha N', roll: 'CS24B2022', email: 'cs24b2022@iiitdm.ac.in', linkedin: 'https://linkedin.com/in/harshitha-nannuri', image: '/technical-affairs-team/tech-development/coordinators/CS24B2022.webp', sort_order: 5 },
];

async function main() {
  console.log(`Seeding ${seed.length} team members…`);
  // Create table if not exists (raw SQL via postgres client)
  await client`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      team_slug VARCHAR(50) NOT NULL,
      sub_role VARCHAR(20) NOT NULL DEFAULT 'coordinator',
      name VARCHAR NOT NULL,
      roll VARCHAR(20) DEFAULT '',
      email TEXT DEFAULT '',
      linkedin TEXT DEFAULT '',
      image TEXT DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active CHAR(1) NOT NULL DEFAULT 'Y'
    )
  `;
  console.log('Table ensured.');

  for (const m of seed) {
    await db.insert(TeamMembers).values({
      team_slug: m.team_slug,
      sub_role: m.sub_role,
      name: m.name,
      roll: m.roll,
      email: m.email,
      linkedin: m.linkedin,
      image: m.image,
      sort_order: m.sort_order,
      active: 'Y',
    }).onConflictDoNothing();
  }
  console.log('Done!');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
