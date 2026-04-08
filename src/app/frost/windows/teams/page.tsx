"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function TeamsPage() {
  return (
    <FrostContentPage
      title="Microsoft Teams"
      subtitle="Online teaching, meetings, and collaboration — powered by your IIITDM account."
      backHref="/frost/windows"
      backLabel="Back to Windows Software"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Windows", href: "/frost/windows" },
      ]}
      accentColor="#f59e0b"
    >
      <Box className="frost-section">
        <Typography className="frost-p">
          Microsoft Teams is the primary platform for online teaching, meetings, and collaboration at IIITDM.
          Teams is included with the Microsoft Office subscription. Sign in using your IIITDM Kerberos credentials:
        </Typography>
        <Box component="pre" className="frost-pre">{`<userid>@iiitdm.ac.in`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download Teams</Typography>
        <Typography className="frost-p">
          Teams is available on all platforms. Download the desktop and mobile apps from Microsoft:{" "}
          <a
            href="https://www.microsoft.com/en-in/microsoft-365/microsoft-teams/download-app"
            target="_blank"
            rel="noopener noreferrer"
            className="frost-link"
          >
            microsoft.com/teams/download-app
          </a>
        </Typography>
        <Typography className="frost-p">
          Alternatively, Teams is accessible directly in your browser at{" "}
          <a href="https://teams.microsoft.com" target="_blank" rel="noopener noreferrer" className="frost-link">
            teams.microsoft.com
          </a>{" "}
          without any installation.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Full Software Catalog</Typography>
        <Typography className="frost-p">
          IIITDM&apos;s CSC page has detailed instructions for all Microsoft software available under the campus agreement:{" "}
          <a
            href="https://csc.iiitdm.ac.in/services-software-windows-os"
            target="_blank"
            rel="noopener noreferrer"
            className="frost-link"
          >
            csc.iiitdm.ac.in/services-software-windows-os
          </a>
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Typography className="frost-p">
          Official Microsoft video training for Teams:{" "}
          <a
            href="https://support.office.com/en-us/article/microsoft-teams-video-training-4f108e54-240b-4351-8084-b1089f0d21d7"
            target="_blank"
            rel="noopener noreferrer"
            className="frost-link"
          >
            Microsoft Teams Video Training
          </a>
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">OneNote Integration</Typography>
        <Typography className="frost-p">
          OneNote is bundled with Teams and Office 365. You can dictate notes, write equations, sketch ideas, and sync across all your devices.{" "}
          <a
            href="https://www.microsoft.com/en-in/microsoft-365/onenote/digital-note-taking-app"
            target="_blank"
            rel="noopener noreferrer"
            className="frost-link"
          >
            Learn more about OneNote
          </a>
        </Typography>
      </Box>
    </FrostContentPage>
  );
}
