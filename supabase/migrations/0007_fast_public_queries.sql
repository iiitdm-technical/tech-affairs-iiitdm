CREATE INDEX IF NOT EXISTS "announcements_active_created_idx"
ON "announcements" ("active", "created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "highlights_active_sort_created_idx"
ON "highlights" ("active", "sort_order", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sponsors_active_sort_idx"
ON "sponsors" ("active", "sort_order");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "achievements_year_created_idx"
ON "achievements" ("year" DESC, "created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orgs_category_sort_idx"
ON "orgs" ("category", "sort_order");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_admins_email_idx"
ON "org_admins" ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clubs_name_idx"
ON "clubs" ("name");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_club_start_idx"
ON "events" ("club_id", "start_time");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx"
ON "sessions" ("user_id");
