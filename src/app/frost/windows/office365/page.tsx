"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function Office365Page() {
  return (
    <FrostContentPage
      title="Microsoft Office 365"
      subtitle="Free for all IIITDM students, staff, and faculty with your institutional account."
      backHref="/frost/windows"
      backLabel="Back to Windows Software"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Windows", href: "/frost/windows" },
      ]}
      accentColor="#a3e635"
    >
      <Box className="frost-section">
        <Typography className="frost-p">
          IIITDMK has subscribed to <strong>Microsoft 365</strong> along with the Microsoft Campus Agreement for all faculty, staff and students.
          Office 365 includes access to Office applications plus cloud services (OneDrive storage) as well as the full desktop versions of
          Word, Excel, PowerPoint, OneNote, Outlook, Publisher, and Access — installable across multiple devices including PCs, Macs, Android, and iOS.
        </Typography>
        <Typography className="frost-p">
          With an active subscription you always have the most up-to-date version of all applications.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">How to Sign In</Typography>
        <Typography className="frost-p">
          Visit{" "}
          <a href="https://office.com" target="_blank" rel="noopener noreferrer" className="frost-link">
            office.com
          </a>{" "}
          and sign in using your IIITDM credentials. Your username format is:
        </Typography>
        <Box component="pre" className="frost-pre">{`<userid>@iiitdm.ac.in`}</Box>
        <Typography className="frost-p">
          For example, if your User ID is <Box component="span" className="frost-code">xyz</Box>, sign in as{" "}
          <Box component="span" className="frost-code">xyz@iiitdm.ac.in</Box> with your IIITDM Kerberos password.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Important Notes</Typography>
        <Box className="frost-note">
          <strong>Password sync:</strong> The user database is synced with IIITDM&apos;s main directory. If you recently changed your IIITDM password, use the updated password here as well. Allow up to a few hours for the sync to propagate.
        </Box>
        <Typography className="frost-p">
          Office 365 applications can be installed on up to 5 PCs or Macs, 5 tablets, and 5 smartphones simultaneously under a single account.
        </Typography>
      </Box>
    </FrostContentPage>
  );
}
