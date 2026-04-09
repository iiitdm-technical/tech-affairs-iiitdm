CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_slug" varchar(50) NOT NULL,
	"sub_role" varchar(20) DEFAULT 'coordinator' NOT NULL,
	"name" varchar NOT NULL,
	"roll" varchar(20) DEFAULT '',
	"email" text DEFAULT '',
	"linkedin" text DEFAULT '',
	"image" text DEFAULT '',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" char(1) DEFAULT 'Y' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "image" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "orgs" ADD COLUMN "authorized_email" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "orgs" ADD COLUMN "club_ref_id" integer;