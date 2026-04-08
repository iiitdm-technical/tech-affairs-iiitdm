"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function DebianPage() {
  return (
    <FrostContentPage
      title="Debian"
      subtitle="Rock-solid stability — the universal operating system and base of Ubuntu, Linux Mint, and hundreds of others."
      backHref="/frost/linux"
      backLabel="Back to Linux"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Linux", href: "/frost/linux" },
      ]}
      accentColor="#a3e635"
    >
      <Box className="frost-section">
        <Typography className="frost-p">
          For Debian users, IIITDM runs an <Box component="span" className="frost-code">apt-cacher-ng</Box> proxy at port{" "}
          <Box component="span" className="frost-code">:9999</Box>. The paths{" "}
          <Box component="span" className="frost-code">/debian</Box> and{" "}
          <Box component="span" className="frost-code">/debian-backports</Box> are transparently proxied to the official Debian archives — giving you
          fast, on-campus download speeds.
        </Typography>
        <Typography className="frost-p">
          Note: Debian discontinued <Box component="span" className="frost-code">debian-volatile</Box>, but an archived copy is available at{" "}
          <a href="http://archive.debian.org" target="_blank" rel="noopener noreferrer" className="frost-link">
            archive.debian.org
          </a>.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Repository Setup</Typography>
        <Typography className="frost-p">
          Add the IIITDM mirror to your <Box component="span" className="frost-code">/etc/apt/sources.list</Box>:
        </Typography>
        <Box component="pre" className="frost-pre">{`deb http://repo.iiitdm.ac.in/debian <release> main contrib non-free`}</Box>
        <Typography className="frost-p">
          Replace <Box component="span" className="frost-code">&lt;release&gt;</Box> with your Debian version codename, e.g.{" "}
          <Box component="span" className="frost-code">bookworm</Box>,{" "}
          <Box component="span" className="frost-code">bullseye</Box>, or{" "}
          <Box component="span" className="frost-code">buster</Box>.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">APT Proxy Configuration</Typography>
        <Typography className="frost-p">
          To route all APT downloads through the campus proxy, create <Box component="span" className="frost-code">/etc/apt/apt.conf.d/01proxy</Box>:
        </Typography>
        <Box component="pre" className="frost-pre">{`Acquire::http { Proxy "http://repo.iiitdm.ac.in:9999"; };`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Per-Command Proxy</Typography>
        <Typography className="frost-p">
          Use the proxy for a single <Box component="span" className="frost-code">apt-get</Box> command without permanently configuring it:
        </Typography>
        <Box component="pre" className="frost-pre">{`apt-get -o 'Acquire::http::Proxy="http://repo.iiitdm.ac.in:9999"' install <package>`}</Box>
        <Typography className="frost-p">Or point directly at the proxied Debian archive:</Typography>
        <Box component="pre" className="frost-pre">{`deb http://repo.iiitdm.ac.in:9999/ftp.debian.org/debian <release> main`}</Box>
      </Box>
    </FrostContentPage>
  );
}
