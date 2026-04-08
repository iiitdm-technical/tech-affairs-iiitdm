"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function LinuxMintPage() {
  return (
    <FrostContentPage
      title="Linux Mint"
      subtitle="Elegant, familiar, and easy — the ideal Linux distribution for users switching from Windows."
      backHref="/frost/linux"
      backLabel="Back to Linux"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Linux", href: "/frost/linux" },
      ]}
      accentColor="#4ade80"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">Overview</Typography>
        <Typography className="frost-p">
          Linux Mint Debian Edition (LMDE) is a semi-rolling release distribution based directly on Debian — not Ubuntu.
          LMDE provides the same polished Mint experience (Cinnamon desktop, software center, familiar layout) while building
          on Debian&apos;s rock-solid foundation.
        </Typography>
        <Typography className="frost-p">
          Since LMDE uses the Debian package format and APT,{" "}
          <Box component="span" className="frost-code">apt-cacher-ng</Box> works out of the box.
          Refer to the <a href="/frost/linux/debian" className="frost-link">Debian section</a> for proxy and repository configuration.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Key Features</Typography>
        <Box component="ul" className="frost-ul">
          <li>Based on Debian — not Ubuntu — for a cleaner, leaner base</li>
          <li>Semi-rolling release: Debian testing packages with periodic stable snapshots</li>
          <li>Cinnamon desktop — Windows-like taskbar layout, easy to navigate</li>
          <li>Nemo file manager — polished, feature-rich file browser</li>
          <li>APT package management — same tooling as Debian and Ubuntu</li>
          <li>Timeshift snapshots — built-in system restore points</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download</Typography>
        <Typography className="frost-p">
          Official LMDE ISO images and torrents are available from the Linux Mint website:{" "}
          <a
            href="https://www.linuxmint.com/download_lmde.php"
            target="_blank"
            rel="noopener noreferrer"
            className="frost-link"
          >
            linuxmint.com/download_lmde.php
          </a>
        </Typography>
        <Box className="frost-note">
          After installation, configure the APT proxy (see the Debian page) to route package downloads through the IIITDM campus mirror for faster speeds.
        </Box>
      </Box>
    </FrostContentPage>
  );
}
