CREATE TABLE "highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"subtitle" text DEFAULT '',
	"image" text NOT NULL,
	"link" text DEFAULT '',
	"tag" varchar(40) DEFAULT '',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" char(1) DEFAULT 'Y' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"logo" text NOT NULL,
	"website" text DEFAULT '',
	"tier" varchar(20) DEFAULT 'general',
	"year" varchar(9) DEFAULT '',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" char(1) DEFAULT 'Y' NOT NULL
);
