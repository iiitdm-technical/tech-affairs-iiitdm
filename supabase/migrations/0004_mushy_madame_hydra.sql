CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_slug" text NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"year" varchar(4) NOT NULL,
	"proof_url" text DEFAULT '',
	"logo" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_slug" text NOT NULL,
	"title" varchar NOT NULL,
	"body" text NOT NULL,
	"link" text DEFAULT '',
	"active" char(1) DEFAULT 'Y' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"org_slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"image" text NOT NULL,
	"link" text NOT NULL,
	"category" varchar(20) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tech_affairs_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"name" varchar NOT NULL,
	"position" varchar DEFAULT '',
	"image" text DEFAULT '',
	"email" text DEFAULT '',
	"linkedin" text DEFAULT '',
	"url" text DEFAULT '',
	"path" text DEFAULT '',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" char(1) DEFAULT 'Y' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking_equipment" ADD CONSTRAINT "booking_equipment_booking_id_equipment_id_pk" PRIMARY KEY("booking_id","equipment_id");--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "authorized_email" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "clubs" ADD COLUMN "org_slug" text DEFAULT '';