import React from "react";
import NewClubPageTemplate from "@/components/NewClubPageTemplate";
import clubData from "@/data/clubs/smartsense";

function SmartSenseClub() {
  return <NewClubPageTemplate {...clubData} />;
}

export default SmartSenseClub;
