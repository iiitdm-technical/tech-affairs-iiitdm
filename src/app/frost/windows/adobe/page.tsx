"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function AdobePage() {
  return (
    <FrostContentPage
      title="Adobe Creative Cloud"
      subtitle="Full Creative Cloud suite — free for all active IIITDM faculty, staff and students."
      backHref="/frost/windows"
      backLabel="Back to Windows Software"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Windows", href: "/frost/windows" },
      ]}
      accentColor="#86efac"
    >
      <Box className="frost-section">
        <Typography className="frost-p">
          IIITDM has subscribed to <strong>Adobe Creative Cloud</strong> for all active faculty, staff and students.
          The subscription includes access to all major Adobe products — Acrobat Reader, Photoshop, Illustrator, Premiere Pro,
          Lightroom, and more — with 100 GB of cloud storage per user.
        </Typography>
        <Typography className="frost-p">
          Applications can be installed on multiple devices: PCs, Macs, Android, and iOS. You always get the latest version automatically.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Included Apps</Typography>
        <Box component="ul" className="frost-ul">
          <li>Acrobat Pro DC — PDF creation, editing, and signing</li>
          <li>Photoshop — professional photo and image editing</li>
          <li>Illustrator — vector graphics and illustration</li>
          <li>Premiere Pro — video editing and production</li>
          <li>Lightroom — photo management and editing</li>
          <li>InDesign — print and digital layout design</li>
          <li>After Effects — motion graphics and visual effects</li>
          <li>100 GB Creative Cloud storage per user</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">How to Access</Typography>
        <Typography className="frost-p">
          Sign in at{" "}
          <a href="https://account.adobe.com/" target="_blank" rel="noopener noreferrer" className="frost-link">
            account.adobe.com
          </a>{" "}
          using your institutional email address in the format:
        </Typography>
        <Box component="pre" className="frost-pre">{`<userid>@<department>.iiitdm.ac.in`}</Box>
        <Typography className="frost-p">
          Adobe will send an OTP to your email. Enter the OTP, set a password, and you&apos;re ready.
          It&apos;s recommended to then download the{" "}
          <strong>Creative Cloud desktop app</strong> to manage and install individual Adobe products.
        </Typography>
      </Box>
    </FrostContentPage>
  );
}
