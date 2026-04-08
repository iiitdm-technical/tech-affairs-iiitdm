"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function OsPage() {
  return (
    <FrostContentPage
      title="Windows OS — Install & Activate"
      subtitle="Step-by-step guide to obtaining, installing, and activating a licensed Windows OS via IIITDM's volume agreement."
      backHref="/frost/windows"
      backLabel="Back to Windows Software"
      breadcrumbs={[
        { label: "FROST", href: "/frost" },
        { label: "Windows", href: "/frost/windows" },
      ]}
      accentColor="#4ade80"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">Prerequisites</Typography>
        <Typography className="frost-p">
          Windows Volume License covers <strong>upgrades only</strong>. You must first have a qualifying, genuine Windows license
          (typically purchased with your hardware from an OEM). When procuring hardware, ensure the OEM provides an underlying Windows
          starter license that can be upgraded under IIITDM&apos;s volume agreement.
        </Typography>
        <Box className="frost-warning">
          <strong>Important:</strong> Without a qualifying base license from your OEM, the volume license upgrade cannot be applied.
          Contact your hardware OEM if unsure.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">1 — Obtain the ISO Image</Typography>
        <Typography className="frost-p">
          Map the network folder as a drive in Windows (My Computer → Tools → Map Network Drive, without &quot;reconnect at login&quot;, using different credentials):
        </Typography>
        <Box component="pre" className="frost-pre">{`\\\\filer02.iiitdm.ac.in\\winisos`}</Box>
        <Typography className="frost-p">
          On Mac or Linux, mount the CIFS share:
        </Typography>
        <Box component="pre" className="frost-pre">{`cifs://filer02.iiitdm.ac.in/winisos`}</Box>
        <Typography className="frost-p">
          Sign in using your IIITDM Kerberos credentials. Copy the required ISO image, burn it to a USB or DVD, then disconnect the network drive.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">2 — Install Windows</Typography>
        <Typography className="frost-p">Boot from the USB/DVD and follow the on-screen installer. After installation:</Typography>
        <Box component="ul" className="frost-ul">
          <li>Configure networking with DHCP (or contact your department sysadmin for static IP parameters)</li>
          <li>Set DNS search suffix to <Box component="span" className="frost-code">ACAD.WINDOWS.IIITDM.AC.IN</Box></li>
          <li>Set internet time server to <Box component="span" className="frost-code">ntp.iiitdm.ac.in</Box></li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">3 — Activate Windows</Typography>
        <Typography className="frost-p">
          Windows must be activated within the 30-day grace period. Your machine must be on the IIITDM LAN (or connected via VPN for off-campus staff).
        </Typography>
        <Typography className="frost-p">
          Run as <strong>Administrator</strong> in Command Prompt:
        </Typography>
        <Box component="pre" className="frost-pre">{`slmgr /skms ccwds.acad.windows.iiitdm.ac.in`}</Box>
        <Typography className="frost-p">
          Then open{" "}
          <a href="https://kmsproxy.iiitdm.ac.in/kms.html" target="_blank" rel="noopener noreferrer" className="frost-link">
            kmsproxy.iiitdm.ac.in/kms.html
          </a>{" "}
          and log in with your IIITDM credentials. Within the next 30 minutes, run:
        </Typography>
        <Box component="pre" className="frost-pre">{`slmgr /ato`}</Box>
        <Typography className="frost-p">Useful diagnostic commands:</Typography>
        <Box component="pre" className="frost-pre">{`slmgr /xpr    # check activation expiry date
slmgr /dli    # license details (summary)
slmgr /dlv    # license details (verbose)`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Grace Period Extension</Typography>
        <Typography className="frost-p">
          The grace period can be extended for an additional 30 days (up to 3 times total) without a LAN connection:
        </Typography>
        <Box component="pre" className="frost-pre">{`slmgr /rearm`}</Box>
        <Box className="frost-warning">
          On expiry of the grace or activation period, Windows enters <strong>Reduced Functionality Mode (RFM)</strong>.
          Re-activate before this happens. A fresh installation may be required if the OS becomes unusable.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Activate Office</Typography>
        <Typography className="frost-p">
          Navigate to your Office installation directory (replace <Box component="span" className="frost-code">1X</Box> with your Office version number, e.g. <Box component="span" className="frost-code">16</Box>):
        </Typography>
        <Box component="pre" className="frost-pre">{`# Office 32-bit on Windows 32-bit:
cd "C:\\Program Files\\Microsoft Office\\Office1X"

# Office 32-bit on Windows 64-bit:
cd "C:\\Program Files (x86)\\Microsoft Office\\Office1X"

# Office 64-bit on Windows 64-bit:
cd "C:\\Program Files\\Microsoft Office\\Office1X"`}</Box>
        <Typography className="frost-p">Set the KMS host then activate:</Typography>
        <Box component="pre" className="frost-pre">{`cscript ospp.vbs /sethst:ccwds.acad.windows.iiitdm.ac.in
cscript ospp.vbs /act`}</Box>
        <Typography className="frost-p">
          Log in to{" "}
          <a href="https://kmsproxy.iiitdm.ac.in/kms.html" target="_blank" rel="noopener noreferrer" className="frost-link">
            kmsproxy.iiitdm.ac.in/kms.html
          </a>{" "}
          before running <Box component="span" className="frost-code">/act</Box>. Check activation status:
        </Typography>
        <Box component="pre" className="frost-pre">{`cscript ospp.vbs /dstatus`}</Box>
      </Box>
    </FrostContentPage>
  );
}
