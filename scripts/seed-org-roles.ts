/**
 * Seed org emails → User_roles ('O') + OrgAdmins + Clubs rows.
 *
 * Safe to re-run: upserts where possible, skips existing rows.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-org-roles.ts
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { Clubs, OrgAdmins, User_roles } from '../src/db/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client });

const orgEmails = [
  { name: 'CS Club',            email: 'csclub@iiitdm.ac.in',       org_slug: 'clubs/cs',         image: '/clubs/csclub/logo.webp' },
  { name: 'Developers Club',    email: 'devclub@iiitdm.ac.in',      org_slug: 'clubs/dev',        image: '/clubs/devclub/logo.png' },
  { name: 'System Coding Club', email: 'scc@iiitdm.ac.in',          org_slug: 'clubs/scc',        image: '/clubs/Scc/logo1.webp' },
  { name: 'Team Nira (AUV)',    email: 'auv.society@iiitdm.ac.in',  org_slug: 'teams/nira',       image: '/teams/nira/logo.webp' },
  { name: 'Team Shunya (MaRS)', email: 'mars@iiitdm.ac.in',         org_slug: 'teams/shunya',     image: '/teams/mars/logo.webp' },
  { name: 'E-Cell',             email: 'ecell@iiitdm.ac.in',        org_slug: 'societies/ecell',  image: '/societies/ecell/logo.webp' },
  { name: 'Team TAD',           email: 'tad@iiitdm.ac.in',          org_slug: 'teams/tad',        image: '/teams/tad/logo.webp' },
  { name: 'Team Astra',         email: 'astra@iiitdm.ac.in',        org_slug: 'teams/astra',      image: '/teams/astra/logo.webp' },
  { name: 'Revolt Racers',      email: 'revoltracers@iiitdm.ac.in', org_slug: 'teams/revolt',     image: '/teams/revolt/logo.webp' },
  { name: 'Optica',             email: 'optica@iiitdm.ac.in',       org_slug: 'societies/optica', image: '/societies/optica/logo.webp' },
  { name: 'IEEE SB',            email: 'ieeesb@iiitdm.ac.in',       org_slug: 'societies/ieee',   image: '/societies/ieee/logo.webp' },
  { name: 'Robotics Club',      email: 'robotics@iiitdm.ac.in',     org_slug: 'clubs/robotics',   image: '/clubs/robotics/logo.webp' },
  { name: 'ASME',               email: 'asme@iiitdm.ac.in',         org_slug: 'societies/asme',   image: '/societies/ASMEStudentSection/logo.webp' },
];

async function run() {
  console.log(`Seeding ${orgEmails.length} org emails…\n`);

  for (const o of orgEmails) {
    // 1. Clubs row (for legacy event system that joins on club_id)
    const existingClub = await db.execute(
      sql`SELECT club_id FROM clubs WHERE org_slug = ${o.org_slug} LIMIT 1`
    );
    if ((existingClub as unknown[]).length === 0) {
      await db.insert(Clubs).values({
        name: o.name,
        iconUrl: o.image,
        authorized_email: o.email,
        org_slug: o.org_slug,
      });
      console.log(`  [clubs]      INSERT  ${o.org_slug}`);
    } else {
      await db.execute(
        sql`UPDATE clubs SET authorized_email = ${o.email} WHERE org_slug = ${o.org_slug}`
      );
      console.log(`  [clubs]      UPDATE  ${o.org_slug}`);
    }

    // 2. OrgAdmins — maps email → slug for the org-admin dashboard
    const existingOA = await db.execute(
      sql`SELECT id FROM org_admins WHERE email = ${o.email} AND org_slug = ${o.org_slug} LIMIT 1`
    );
    if ((existingOA as unknown[]).length === 0) {
      await db.insert(OrgAdmins).values({ email: o.email, org_slug: o.org_slug });
      console.log(`  [org_admins] INSERT  ${o.email} → ${o.org_slug}`);
    } else {
      console.log(`  [org_admins] EXISTS  ${o.email} → ${o.org_slug}`);
    }

    // 3. User_roles — role 'O' lets them access /org-admin
    await db
      .insert(User_roles)
      .values({ email: o.email, role: 'O' })
      .onConflictDoUpdate({ target: User_roles.email, set: { role: 'O' } });
    console.log(`  [user_roles] UPSERT  ${o.email} → O\n`);
  }

  console.log('Done.');
  await client.end();
}

run().catch((err) => { console.error(err); process.exit(1); });
