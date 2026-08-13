import React from "react";
import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import clubData from "@/data/clubs/scc";

function SCC() {
  return <NewClubPageTemplate {...clubData} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default SCC;
