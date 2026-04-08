/**
 * Removes old placeholder/personal org admin entries and their user_roles.
 * Keeps only the official org emails.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/cleanup-old-org-roles.ts
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client });

// Official org emails — these stay
const KEEP_EMAILS = new Set([
  'csclub@iiitdm.ac.in',
  'devclub@iiitdm.ac.in',
  'scc@iiitdm.ac.in',
  'auv.society@iiitdm.ac.in',
  'mars@iiitdm.ac.in',
  'ecell@iiitdm.ac.in',
  'tad@iiitdm.ac.in',
  'astra@iiitdm.ac.in',
  'revoltracers@iiitdm.ac.in',
  'optica@iiitdm.ac.in',
  'ieeesb@iiitdm.ac.in',
  'robotics@iiitdm.ac.in',
  'asme@iiitdm.ac.in',
]);

async function run() {
  // Fetch all org_admins rows
  const allRows = await db.execute(sql`SELECT id, email, org_slug FROM org_admins`);

  const toDelete = (allRows as { id: number; email: string; org_slug: string }[])
    .filter((r) => !KEEP_EMAILS.has(r.email));

  if (toDelete.length === 0) {
    console.log('Nothing to delete — already clean.');
    await client.end();
    return;
  }

  console.log(`Deleting ${toDelete.length} stale org_admins rows:`);
  for (const r of toDelete) {
    console.log(`  [org_admins] DELETE id=${r.id}  ${r.email} → ${r.org_slug}`);
    await db.execute(sql`DELETE FROM org_admins WHERE id = ${r.id}`);
  }

  // Also remove stale user_roles entries that aren't official org emails
  // (skip super-admins — only remove role='O' entries not in KEEP_EMAILS)
  const staleRoles = await db.execute(
    sql`SELECT email FROM user_roles WHERE role = 'O' AND email NOT IN (${sql.join(
      [...KEEP_EMAILS].map((e) => sql`${e}`),
      sql`, `
    )})`
  );

  if ((staleRoles as unknown[]).length > 0) {
    console.log(`\nDeleting ${(staleRoles as unknown[]).length} stale user_roles entries:`);
    for (const r of staleRoles as { email: string }[]) {
      console.log(`  [user_roles] DELETE  ${r.email}`);
      await db.execute(sql`DELETE FROM user_roles WHERE email = ${r.email} AND role = 'O'`);
    }
  }

  console.log('\nDone.');
  await client.end();
}

run().catch((err) => { console.error(err); process.exit(1); });
