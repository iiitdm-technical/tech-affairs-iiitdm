"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function GentooPage() {
  return (
    <FrostContentPage
      title="Gentoo"
      subtitle="Source-based Linux — compile everything from scratch for maximum control, optimization, and performance."
      backHref="/frost/linux"
      backLabel="Back to Linux"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Linux", href: "/frost/linux" },
      ]}
      accentColor="#86efac"
    >
      <Box className="frost-section">
        <Typography className="frost-p">
          IIITDM mirrors the Gentoo portage tree and distfiles via rsync and HTTP. Using the campus mirror dramatically speeds up{" "}
          <Box component="span" className="frost-code">emerge sync</Box> and package downloads compared to pulling from external servers.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Configure the Mirror</Typography>
        <Typography className="frost-p">
          Add the following to <Box component="span" className="frost-code">/etc/make.conf</Box> (or{" "}
          <Box component="span" className="frost-code">/etc/portage/make.conf</Box> on modern Gentoo):
        </Typography>
        <Box component="pre" className="frost-pre">{`SYNC="rsync://repo.iiitdm.ac.in/gentoo-portage"
GENTOO_MIRRORS="http://repo.iiitdm.ac.in/gentoo"`}</Box>
        <Typography className="frost-p">
          Then run <Box component="span" className="frost-code">emerge --sync</Box> to pull the latest portage tree from the campus mirror.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">About Gentoo</Typography>
        <Box component="ul" className="frost-ul">
          <li>Every package is compiled from source — optimized for your exact hardware</li>
          <li>USE flags give fine-grained control over features included in each package</li>
          <li>Rolling release — always have the latest software without reinstalling</li>
          <li>Excellent for learning how Linux systems work from the ground up</li>
        </Box>
        <Box className="frost-note">
          Gentoo is not recommended for first-time Linux users. It requires comfort with compiling software, editing config files,
          and troubleshooting build failures. Start with Debian or Ubuntu if you&apos;re new to Linux.
        </Box>
      </Box>
    </FrostContentPage>
  );
}
