"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function UbuntuPage() {
  return (
    <FrostContentPage
      title="Ubuntu"
      subtitle="The most widely used Linux distribution on campus — beginner-friendly with long-term support releases and a massive community."
      backHref="/frost/linux"
      backLabel="Back to Linux"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Linux", href: "/frost/linux" },
      ]}
      accentColor="#f97316"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">Campus Mirror</Typography>
        <Typography className="frost-p">
          IIITDM maintains a full Ubuntu mirror in compliance with official guidelines.
          Updates reach the campus server with a maximum delay of <strong>6 hours</strong>.
          This means you get fast, on-campus download speeds while still receiving timely security patches.
        </Typography>
        <Typography className="frost-p">
          Check the{" "}
          <a href="https://ubuntu.com/about/release-cycle" target="_blank" rel="noopener noreferrer" className="frost-link">
            Ubuntu release cycle
          </a>{" "}
          to see which versions are currently supported.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">APT Repository Configuration</Typography>
        <Typography className="frost-p">
          Replace <Box component="span" className="frost-code">&lt;release&gt;</Box> with your Ubuntu codename (e.g.{" "}
          <Box component="span" className="frost-code">noble</Box>,{" "}
          <Box component="span" className="frost-code">jammy</Box>,{" "}
          <Box component="span" className="frost-code">focal</Box>) in{" "}
          <Box component="span" className="frost-code">/etc/apt/sources.list</Box>:
        </Typography>
        <Box component="pre" className="frost-pre">{`deb http://repo.iiitdm.ac.in/ubuntu <release> main restricted universe multiverse
deb http://repo.iiitdm.ac.in/ubuntu <release>-updates main restricted universe multiverse
deb http://repo.iiitdm.ac.in/ubuntu <release>-security main restricted universe multiverse
# deb http://repo.iiitdm.ac.in/ubuntu <release>-backports main restricted universe multiverse
# deb http://repo.iiitdm.ac.in/ubuntu <release>-proposed main restricted universe multiverse`}</Box>
        <Typography className="frost-p">
          After editing, run <Box component="span" className="frost-code">sudo apt update</Box> to refresh the package lists.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Supported Release ISOs</Typography>
        <Typography className="frost-p">
          CD/DVD images for all currently supported releases are available from the official Ubuntu image server:{" "}
          <a href="http://cdimage.ubuntu.com" target="_blank" rel="noopener noreferrer" className="frost-link">
            cdimage.ubuntu.com
          </a>
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">End-of-Life (EOL) Releases</Typography>
        <Typography className="frost-p">
          Legacy software sometimes requires an EOL Ubuntu release. CD images for EOL versions:{" "}
          <a href="http://old-releases.ubuntu.com/releases/" target="_blank" rel="noopener noreferrer" className="frost-link">
            old-releases.ubuntu.com/releases
          </a>
        </Typography>
        <Typography className="frost-p">
          Package repositories for all EOL releases are available at{" "}
          <a href="http://old-releases.ubuntu.com/ubuntu/" target="_blank" rel="noopener noreferrer" className="frost-link">
            old-releases.ubuntu.com/ubuntu
          </a>.
          Requests to EOL repos are transparently proxied — intermediate directories are not browsable.
        </Typography>
        <Box className="frost-warning">
          EOL releases no longer receive security updates. Understand the security implications before running EOL software in any production or network-connected environment.
        </Box>
      </Box>
    </FrostContentPage>
  );
}
