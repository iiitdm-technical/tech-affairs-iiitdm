import React from "react";
import ClubPageTemplate from "@/components/ClubPageTemplate";
import clubData from "@/data/societies/ecell";

// ClubPageTemplate (old template) uses `description` instead of `introduction`,
// and its Project type uses `title` + `icons` instead of `name` + `image`.
const templateProps = {
  name: clubData.name,
  logo: clubData.logo,
  description: clubData.introduction,
  core: clubData.core,
  links: clubData.links,
  projects: clubData.projects.map((p) => ({
    title: p.name,
    description: p.description,
    themeColor: p.themeColor ?? "#7C3AED",
    icons: [] as React.ReactElement[],
  })),
};

function ECell() {
  return <ClubPageTemplate {...templateProps} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default ECell;
