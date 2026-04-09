import { boolean, integer, varchar, char, pgTable, serial, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';


export const Users = pgTable('users', {
    user_id: serial('user_id').primaryKey().notNull(),
    google_id: text('google_id').notNull(),
    name: varchar("name").notNull(),
    email: text('email').notNull(),
    picture: text('picture').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),

});

export const Sessions = pgTable('sessions', {
    session_id: text('session_id').primaryKey().notNull(),
    user_id: integer('user_id').notNull().references(() => Users.user_id),
    expires_at: timestamp('expires_at').notNull(),

});

export const Clubs = pgTable('clubs', {
    club_id: serial('club_id').primaryKey().notNull(),
    name: varchar('name').notNull(),
    iconUrl: text('iconUrl').notNull(),
    authorized_email: text('authorized_email').default(''),
    org_slug: text('org_slug').default(''),
});

export const Events = pgTable('events', {
    event_id: serial('event_id').primaryKey().notNull(),
    club_id: integer('club_id').notNull().references(() => Clubs.club_id),
    name: varchar('name').notNull(),
    description: text('description').notNull(),
    start_time: timestamp('start_time').notNull(),
    end_time: timestamp('end_time').notNull(),
    location: varchar('location').notNull(),
    link: text('link').notNull(),
    requirements: text('requirements').notNull(),
    imageUrl: text('imageUrl')
});


export const User_roles = pgTable('user_roles', {
    email: text('email').notNull().primaryKey(),
    role: char('role', { length: 1 }).notNull(), // A for admin, U for user
});

export const i2r_equipment = pgTable('equipment', {
    equipment_id: serial('eq_id').primaryKey().notNull(),
    name: varchar('name').notNull(),
    category: varchar('category').notNull(),
    description: text('description').notNull(),
    imageUrl: text('imageUrl'),
    status: char('status', { length: 1 }).notNull(), // A for available, B for booked, U for under maintenance
})

export const i2r_bookings = pgTable('bookings', {
    booking_id: serial('booking_id').primaryKey().notNull(),
    user_id: integer('user_id').notNull().references(() => Users.user_id),
    department: varchar('department').notNull(),
    project_name: varchar('project_name').notNull(),
    intended_use: text('intended_use').notNull(),

    start_time: timestamp('start_time').notNull(),
    end_time: timestamp('end_time').notNull(),

    status: char('status', { length: 1 }).notNull().default('P'), // P for pending, A for approved, R for rejected
    created_at: timestamp('created_at').defaultNow().notNull(),
    comments: text('comments').notNull().default(''),

});

export const i2r_booking_equipment = pgTable('booking_equipment', {
    booking_id: integer('booking_id').notNull().references(() => i2r_bookings.booking_id),
    equipment_id: integer('equipment_id').notNull().references(() => i2r_equipment.equipment_id),

}, (table) => [
    primaryKey({ columns: [table.booking_id, table.equipment_id] }),
]);

// Maps an email address to one or more org slugs (e.g. 'cs', 'nira', 'ieee').
// Role 'O' users are looked up here to determine which org dashboard they can access.
// Super-admins (role 'A') bypass this table entirely.
export const OrgAdmins = pgTable('org_admins', {
    id: serial('id').primaryKey().notNull(),
    email: text('email').notNull(),       // e.g. csclub@iiitdm.ac.in
    org_slug: text('org_slug').notNull(), // e.g. 'cs', 'nira', 'ieee'
});

export const Announcements = pgTable('announcements', {
    id: serial('id').primaryKey().notNull(),
    org_slug: text('org_slug').notNull(),
    title: varchar('title').notNull(),
    body: text('body').notNull(),
    link: text('link').default(''),
    media_url: text('media_url').default(''), // optional image or PDF attachment
    active: char('active', { length: 1 }).notNull().default('Y'), // Y = visible, N = hidden
    created_at: timestamp('created_at').defaultNow().notNull(),
});

// All clubs, teams, societies, and communities — replaces src/data/orgs.ts.
// category: 'club' | 'team' | 'society' | 'community'
export const Orgs = pgTable('orgs', {
    id: serial('id').primaryKey().notNull(),
    name: varchar('name').notNull(),
    image: text('image').notNull(),          // public asset path e.g. /clubs/csclub/logo.webp
    link: text('link').notNull(),            // URL path e.g. /clubs/cs
    category: varchar('category', { length: 20 }).notNull(), // club | team | society | community
    sort_order: integer('sort_order').notNull().default(0),
    authorized_email: text('authorized_email').default(''), // org-admin email for this org
    club_ref_id: integer('club_ref_id'),     // FK back to clubs table (for events)
});

// Technical Affairs internal team — secretary, joint-secretary, faculty, social media, core teams.
// type: 'sac' | 'faculty' | 'social' | 'core_team'
export const TechAffairsTeam = pgTable('tech_affairs_team', {
    id: serial('id').primaryKey().notNull(),
    type: varchar('type', { length: 20 }).notNull(), // sac | faculty | social | core_team
    name: varchar('name').notNull(),
    position: varchar('position').default(''),       // e.g. "Technical Affairs Secretary"
    image: text('image').default(''),
    email: text('email').default(''),
    linkedin: text('linkedin').default(''),
    url: text('url').default(''),                    // for social links (instagram/linkedin/youtube)
    path: text('path').default(''),                  // for core_team nav links
    sort_order: integer('sort_order').notNull().default(0),
    active: char('active', { length: 1 }).notNull().default('Y'), // Y = active, N = hidden
});

// Members within each core team (management, innovation, etc.)
// sub_role: 'core' | 'coordinator'
export const TeamMembers = pgTable('team_members', {
    id: serial('id').primaryKey().notNull(),
    team_slug: varchar('team_slug', { length: 50 }).notNull(), // management | innovation | media-and-marketing | social-outreach | tech-development
    sub_role: varchar('sub_role', { length: 20 }).notNull().default('coordinator'), // core | coordinator
    name: varchar('name').notNull(),
    roll: varchar('roll', { length: 20 }).default(''),
    email: text('email').default(''),
    linkedin: text('linkedin').default(''),
    image: text('image').default(''),
    sort_order: integer('sort_order').notNull().default(0),
    active: char('active', { length: 1 }).notNull().default('Y'),
});

// Highlights — Media & Marketing team uploads (external programs, events, reels, etc.)
export const Highlights = pgTable('highlights', {
    id: serial('id').primaryKey().notNull(),
    title: varchar('title').notNull(),
    subtitle: text('subtitle').default(''),    // short caption
    image: text('image').notNull(),            // Supabase public URL
    link: text('link').default(''),            // optional external link
    tag: varchar('tag', { length: 40 }).default(''), // e.g. 'Workshop', 'External Program', 'Vaidehi'
    sort_order: integer('sort_order').notNull().default(0),
    active: char('active', { length: 1 }).notNull().default('Y'),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

// Sponsors — can be managed by super-admin
export const Sponsors = pgTable('sponsors', {
    id: serial('id').primaryKey().notNull(),
    name: varchar('name').notNull(),
    logo: text('logo').notNull(),              // Supabase public URL or public asset path
    website: text('website').default(''),
    tier: varchar('tier', { length: 20 }).default('general'), // 'title' | 'gold' | 'silver' | 'general'
    year: varchar('year', { length: 9 }).default(''),         // e.g. '2025-26'
    sort_order: integer('sort_order').notNull().default(0),
    active: char('active', { length: 1 }).notNull().default('Y'),
});

// Achievements managed via the org-admin / super-admin dashboard.
// Replaces / extends the static src/data/achievements.ts for dynamically-added entries.
// Frost open contributions — community-submitted additions/corrections to FROST pages.
// status: 'pending' | 'approved' | 'rejected'
// action_type: 'add' | 'edit' | 'delete'
export const FrostContributions = pgTable('frost_contributions', {
    id: serial('id').primaryKey().notNull(),
    page_path: text('page_path').notNull(),       // e.g. '/frost/linux/debian'
    page_title: varchar('page_title').notNull(),  // e.g. 'Debian'
    title: varchar('title').notNull(),            // contribution title/section name
    body: text('body').notNull(),                 // markdown content
    author_id: integer('author_id').notNull().references(() => Users.user_id),
    author_name: varchar('author_name').notNull(),
    author_email: text('author_email').notNull(),
    status: varchar('status', { length: 10 }).notNull().default('pending'), // pending | approved | rejected
    reviewed_by: text('reviewed_by').default(''), // admin name who reviewed
    reviewed_at: timestamp('reviewed_at'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    deleted_at: timestamp('deleted_at'),          // set when admin deletes
    deleted_by: text('deleted_by').default(''),
});

export const Achievements = pgTable('achievements', {
    id: serial('id').primaryKey().notNull(),
    org_slug: text('org_slug').notNull(),   // e.g. 'nira', 'cs'
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    year: varchar('year', { length: 4 }).notNull(),
    proof_url: text('proof_url').default(''),
    logo: text('logo').default(''),         // optional override; falls back to org logo
    image: text('image').default(''),       // competition photo shown in carousel
    created_at: timestamp('created_at').defaultNow().notNull(),
});

