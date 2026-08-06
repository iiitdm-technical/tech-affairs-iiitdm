WITH keeper AS (
  SELECT "id"
  FROM "orgs"
  WHERE lower("name") LIKE 'cybersecurity%'
    OR "link" IN ('/clubs/cybersecurity', '/communities/cybersecurity')
  ORDER BY CASE WHEN "link" = '/clubs/cybersecurity' THEN 0 ELSE 1 END, "id"
  LIMIT 1
), deleted AS (
  DELETE FROM "orgs"
  WHERE (
      lower("name") LIKE 'cybersecurity%'
      OR "link" IN ('/clubs/cybersecurity', '/communities/cybersecurity')
    )
    AND "id" NOT IN (SELECT "id" FROM keeper)
)
UPDATE "orgs"
SET
  "name" = 'Cybersecurity Club',
  "image" = '/clubs/cybersecurity/logo.jpg',
  "link" = '/clubs/cybersecurity',
  "category" = 'club',
  "sort_order" = 5
WHERE "id" IN (SELECT "id" FROM keeper);
--> statement-breakpoint
INSERT INTO "orgs" ("name", "image", "link", "category", "sort_order")
SELECT 'Cybersecurity Club', '/clubs/cybersecurity/logo.jpg', '/clubs/cybersecurity', 'club', 5
WHERE NOT EXISTS (
  SELECT 1 FROM "orgs" WHERE "link" = '/clubs/cybersecurity'
);
--> statement-breakpoint
UPDATE "orgs"
SET "sort_order" = 1
WHERE "link" = '/communities/gamedevelopers'
  AND "category" = 'community';
