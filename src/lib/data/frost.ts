import catalogData from "../../../data/frost/catalog.json";
import contributionsData from "../../../data/frost/contributions.json";
import guidesData from "../../../data/frost/guides.json";

export interface FrostInline {
  text: string;
  bold?: boolean;
  code?: boolean;
  href?: string;
}

export type FrostBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph" | "note" | "warning"; content: FrostInline[] }
  | { type: "list"; ordered?: boolean; items: FrostInline[][] }
  | { type: "code"; text: string };

export interface FrostGuide {
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  breadcrumbs: { label: string; href: string }[];
  accentColor: string;
  blocks: FrostBlock[];
}

export interface FrostCatalogItem {
  title: string;
  slug: string;
  icon: string;
  color: string;
  tag?: string;
  description: string;
}

export interface FrostCategory {
  title: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  summaryItems: string[];
  pageTitle: string;
  pageDescription: string;
  items: FrostCatalogItem[];
}

export interface FrostContribution {
  id: number | string;
  page_path: string;
  page_title?: string;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
  status: "approved";
}

export const frostCatalog = catalogData as {
  title: string;
  eyebrow: string;
  description: string;
  categories: FrostCategory[];
};

const frostGuides = guidesData as unknown as Record<string, FrostGuide>;
const frostContributions = contributionsData as FrostContribution[];

export function getFrostCategory(slug: string): FrostCategory {
  const category = frostCatalog.categories.find((entry) => entry.slug === slug);
  if (!category) throw new Error(`Unknown FROST category: ${slug}`);
  return category;
}

export function getFrostGuide(slug: string): FrostGuide {
  const guide = frostGuides[slug];
  if (!guide) throw new Error(`Unknown FROST guide: ${slug}`);
  return guide;
}

export function getFrostContributions(pagePath?: string): FrostContribution[] {
  return frostContributions.filter(
    (entry) => entry.status === "approved" && (!pagePath || entry.page_path === pagePath),
  );
}
