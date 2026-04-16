import { db } from "@/db";
import { Users, User_roles, OrgAdmins } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface User {
    id: number;
    email: string;
    googleId: string;
    name: string;
    picture: string;
    role: string;       // Primary role for backward compatibility: A > O > U
    roles: string[];    // All roles assigned to this user
    orgSlugs: string[]; // org slugs this user can manage (if role O is present)
}

function derivePrimaryRole(roles: string[]): string {
    if (roles.includes('A')) return 'A';
    if (roles.includes('O')) return 'O';
    return 'U';
}

async function getOrgSlugs(email: string): Promise<string[]> {
    const rows = await db
        .select({ org_slug: OrgAdmins.org_slug })
        .from(OrgAdmins)
        .where(eq(OrgAdmins.email, email));
    return rows.map((r) => r.org_slug);
}

export async function createUser(googleId: string, email: string, name: string, picture: string): Promise<User> {
    const rows = await db
        .insert(Users)
        .values({ google_id: googleId, email, name, picture })
        .returning({ id: Users.user_id });

    if (rows === null) throw new Error("Unexpected error");

    return {
        id: rows[0].id,
        googleId,
        email,
        name,
        picture,
        role: 'U',
        roles: ['U'],
        orgSlugs: [],
    };
}

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
    const rows = await db
        .select({
            id: Users.user_id,
            googleId: Users.google_id,
            email: Users.email,
            name: Users.name,
            picture: Users.picture,
        })
        .from(Users)
        .where(eq(Users.google_id, googleId));

    if (rows.length === 0) return null;

    const userRow = rows[0];

    const roleRows = await db
        .select({ role: User_roles.role })
        .from(User_roles)
        .where(eq(User_roles.email, userRow.email));

    const roles = [...new Set(roleRows.map((r) => r.role).filter(Boolean))];
    const effectiveRoles = roles.length > 0 ? roles : ['U'];
    const role = derivePrimaryRole(effectiveRoles);
    const orgSlugs = effectiveRoles.includes('O') || effectiveRoles.includes('A')
        ? await getOrgSlugs(userRow.email)
        : [];

    return {
        id: userRow.id,
        googleId: userRow.googleId,
        email: userRow.email,
        name: userRow.name,
        picture: userRow.picture,
        role,
        roles: effectiveRoles,
        orgSlugs,
    };
}