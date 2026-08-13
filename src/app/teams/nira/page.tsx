import React from "react";
import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import clubData from "@/data/teams/nira";

function NiraPage() {
  return <NewClubPageTemplate {...clubData} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default NiraPage;
