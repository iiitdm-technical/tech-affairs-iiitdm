"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function AnsysPage() {
  return (
    <FrostContentPage
      title="ANSYS"
      subtitle="Industry-leading simulation suite for structural, thermal, fluid, and electromagnetic analysis used by engineers worldwide."
      backHref="/frost/scientific"
      backLabel="Back to Scientific Software"
      breadcrumbs={[{ label: "FROST", href: "/frost" }, { label: "Scientific", href: "/frost/scientific" }]}
      accentColor="#a3e635"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">What is ANSYS?</Typography>
        <Typography className="frost-p">
          ANSYS is a suite of engineering simulation software covering finite element analysis (FEA), computational fluid dynamics (CFD),
          electromagnetics, and systems simulation. It is used across aerospace, automotive, civil, mechanical, and electronics industries
          to validate designs before physical prototyping — saving cost and time.
        </Typography>
        <Typography className="frost-p">
          Key products in the suite: <strong>ANSYS Mechanical</strong> (structural/thermal FEA),{" "}
          <strong>ANSYS Fluent</strong> (CFD), <strong>ANSYS HFSS</strong> (electromagnetics),{" "}
          <strong>ANSYS Workbench</strong> (unified simulation environment).
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download & Install</Typography>
        <Box component="ol" className="frost-ul" sx={{ listStyleType: "decimal" }}>
          <li>Obtain the license server address and port from CSC (format: <Box component="span" className="frost-code">1055@licserver.iiitdm.ac.in</Box>)</li>
          <li>Download the ANSYS installer ISO from the ANSYS Customer Portal or the CSC file server</li>
          <li>Mount the ISO and run <Box component="span" className="frost-code">setup.exe</Box> (Windows) or the Linux installer script</li>
          <li>During installation, select <strong>Configure license server</strong> and enter the campus license server address</li>
          <li>Select only the products you need — full install can exceed 50 GB</li>
        </Box>
        <Box className="frost-warning">
          ANSYS requires a network connection to the IIITDM LAN (or VPN) to check out a license at launch. It will not run offline without a standalone license file.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">System Requirements</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>OS:</strong> Windows 10/11 64-bit or RHEL/CentOS/Ubuntu Linux</li>
          <li><strong>RAM:</strong> 8 GB minimum — 32 GB+ strongly recommended for large models</li>
          <li><strong>Disk:</strong> 30–60 GB for a typical install (varies by products selected)</li>
          <li><strong>GPU:</strong> NVIDIA GPU with CUDA support improves solver performance significantly</li>
          <li><strong>CPU:</strong> Multi-core processor; ANSYS scales well with core count</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">ANSYS Workbench Workflow</Typography>
        <Typography className="frost-p">The standard simulation workflow in Workbench:</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>Geometry</strong> — create or import CAD geometry (STEP, IGES, Parasolid, SpaceClaim)</li>
          <li><strong>Mesh</strong> — discretize the geometry; control element size, inflation layers for CFD</li>
          <li><strong>Setup</strong> — apply boundary conditions, material properties, loads</li>
          <li><strong>Solution</strong> — run the solver (CPU/GPU parallel); monitor convergence</li>
          <li><strong>Results</strong> — post-process: stress contours, velocity fields, temperature maps, animations</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">ANSYS Student Edition (Free)</Typography>
        <Typography className="frost-p">
          ANSYS offers a free Student Edition with size-limited models (128k nodes for structural, 512k cells for Fluent).
          Sufficient for coursework and learning. Download from{" "}
          <Box component="span" className="frost-code">ansys.com/academic/students</Box> — no license server needed.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Box component="ul" className="frost-ul">
          <li>ANSYS Innovation Courses — free video courses at <Box component="span" className="frost-code">courses.ansys.com</Box></li>
          <li>ANSYS How-To videos on YouTube (official channel)</li>
          <li>ANSYS Learning Hub — structured learning paths for each product</li>
          <li>SimCafe (Cornell) — tutorial repository for ANSYS Fluent and Mechanical</li>
        </Box>
      </Box>
    </FrostContentPage>
  );
}
