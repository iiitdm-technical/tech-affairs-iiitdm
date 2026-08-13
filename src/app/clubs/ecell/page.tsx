import React from "react";
import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import clubData from "@/data/societies/ecell";

function ECellClub() {
  return <NewClubPageTemplate {...clubData} />;
}

export default ECellClub;
