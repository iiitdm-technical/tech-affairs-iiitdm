import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Supabase free tier: max ~15 simultaneous connections across all services.
// Keep pool small so we never exhaust the limit.
// IMPORTANT: In dev, the globalThis singleton means hot-reloads reuse the same client.
// If the client is dead (e.g. after a failed session-pooler attempt), restart the server.
const globalForDb = globalThis as unknown as {
  _pgClient?: ReturnType<typeof postgres>;
  _pgClientUrl?: string;
};

const url = process.env.DATABASE_URL!;

// If the URL changed (e.g. env var updated), drop the old client
if (globalForDb._pgClientUrl && globalForDb._pgClientUrl !== url) {
  globalForDb._pgClient = undefined;
}

const client =
  globalForDb._pgClient ??
  postgres(url, {
    prepare: false,       // required for Supabase PgBouncer transaction mode
    max: 3,               // small pool — free tier has ~15 total
    idle_timeout: 20,     // release idle connections quickly
    connect_timeout: 10,  // fail fast on timeout
    max_lifetime: 1800,   // recycle connections every 30 min to avoid stale ones
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb._pgClient = client;
  globalForDb._pgClientUrl = url;
}

export const db = drizzle({ client });
