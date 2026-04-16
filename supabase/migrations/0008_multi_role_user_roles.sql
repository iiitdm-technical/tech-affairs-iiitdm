ALTER TABLE "user_roles" DROP CONSTRAINT IF EXISTS "user_roles_pkey";
--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("email", "role");
