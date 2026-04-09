"use server";

import { db } from "@/db";
import { Sessions, User_roles, Users, OrgAdmins } from "@/db/schema";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { cache } from "react";

import type { User } from "./user";

export interface Session {
	id: string;
	expiresAt: Date;
	userId: number;
}

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	// Single query: session + user + role + org mappings joined.
	const rows = await db
		.select({
			sessionId: Sessions.session_id,
			sessionUserId: Sessions.user_id,
			sessionExpiresAt: Sessions.expires_at,
			userId: Users.user_id,
			googleId: Users.google_id,
			email: Users.email,
			name: Users.name,
			picture: Users.picture,
			role: User_roles.role,
			orgSlug: OrgAdmins.org_slug,
		})
		.from(Sessions)
		.innerJoin(Users, eq(Sessions.user_id, Users.user_id))
		.leftJoin(User_roles, eq(User_roles.email, Users.email))
		.leftJoin(OrgAdmins, eq(OrgAdmins.email, Users.email))
		.where(eq(Sessions.session_id, sessionId))
		.limit(64);

	if (rows.length === 0) return { session: null, user: null };

	const row = rows[0];

	// Check expiry before further queries
	const now = Date.now();
	if (now >= row.sessionExpiresAt.getTime()) {
		await db.delete(Sessions).where(eq(Sessions.session_id, sessionId));
		return { session: null, user: null };
	}

	const role = row.role ?? 'U';
	// Deduplicate slugs because joins can return repeated rows.
	const orgSlugs = [...new Set(rows.map((r) => r.orgSlug).filter((s): s is string => Boolean(s)))];

	const session: Session = {
		id: row.sessionId,
		userId: row.sessionUserId,
		expiresAt: row.sessionExpiresAt,
	};

	const user: User = {
		id: row.userId,
		googleId: row.googleId,
		email: row.email,
		name: row.name,
		picture: row.picture,
		role,
		orgSlugs,
	};

	// Renew session if expiring in < 15 days
	if (now >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(now + 1000 * 60 * 60 * 24 * 30);
		await db.update(Sessions)
			.set({ expires_at: session.expiresAt })
			.where(eq(Sessions.session_id, session.id));
	}

	return { session, user };
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
	const token = (await cookies()).get("session")?.value ?? null;
	if (!token) return { session: null, user: null };
	return validateSessionToken(token);
});

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(Sessions).where(eq(Sessions.session_id, sessionId));
}

export async function invalidateUserSessions(userId: number): Promise<void> {
	await db.delete(Sessions).where(eq(Sessions.session_id, userId.toString()));
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
	(await cookies()).set("session", token, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: expiresAt,
	});
}

export async function deleteSessionTokenCookie(): Promise<void> {
	(await cookies()).set("session", "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
	});
}

export async function generateSessionToken(): Promise<string> {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	return encodeBase32(tokenBytes).toLowerCase();
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	await db.insert(Sessions).values({
		session_id: sessionId,
		user_id: userId,
		expires_at: expiresAt,
	});

	return { id: sessionId, userId, expiresAt };
}
