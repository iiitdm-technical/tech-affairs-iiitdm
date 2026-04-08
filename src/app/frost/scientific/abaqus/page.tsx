"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function AbaqusPage() {
  return (
    <FrostContentPage
      title="Abaqus"
      subtitle="Advanced nonlinear finite element analysis for materials, structures, crash simulations, and manufacturing processes."
      backHref="/frost/scientific"
      backLabel="Back to Scientific Software"
      breadcrumbs={[{ label: "FROST", href: "/frost" }, { label: "Scientific", href: "/frost/scientific" }]}
      accentColor="#86efac"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">What is Abaqus?</Typography>
        <Typography className="frost-p">
          Abaqus (part of the Dassault Systèmes SIMULIA suite) is a powerful FEA solver focused on{" "}
          <strong>nonlinear structural mechanics</strong> — large deformations, contact, material plasticity, damage, and fracture.
          It handles problems that linear solvers cannot: metal forming, crash impact, rubber sealing, and composite failure.
        </Typography>
        <Typography className="frost-p">
          Two main solvers: <strong>Abaqus/Standard</strong> (implicit, for static and low-speed dynamic problems) and{" "}
          <strong>Abaqus/Explicit</strong> (for high-speed impact, crash, and forming processes).
          <strong> Abaqus/CAE</strong> is the graphical pre/post-processor.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download & Install</Typography>
        <Box component="ol" className="frost-ul" sx={{ listStyleType: "decimal" }}>
          <li>Obtain the SIMULIA license server details from CSC or your department</li>
          <li>Download the installer from the 3DS (Dassault) customer portal or the campus file server</li>
          <li>Run <Box component="span" className="frost-code">setup.exe</Box> — install Abaqus/CAE, Standard, and Explicit solvers</li>
          <li>During setup, configure the FLEXnet license server with the campus address and port</li>
          <li>Optionally install <strong>fe-safe</strong> (fatigue) and <strong>Isight</strong> (optimization) if licensed</li>
        </Box>
        <Box className="frost-warning">
          Abaqus requires a LAN or VPN connection to the campus license server at runtime. Floating licenses are checked out per solver token.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">System Requirements</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>OS:</strong> Windows 10/11 64-bit or Linux (RHEL 7/8, CentOS)</li>
          <li><strong>RAM:</strong> 8 GB minimum — 32 GB+ for large nonlinear models</li>
          <li><strong>Disk:</strong> ~15 GB for base install; large models generate multi-GB result files</li>
          <li><strong>CPU:</strong> Multi-core recommended; Abaqus parallelizes using MPI or shared memory</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Abaqus/CAE Workflow</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>Part</strong> — create geometry (sketch-based) or import CAD</li>
          <li><strong>Property</strong> — define material (elastic, plastic, hyperelastic, composite layup)</li>
          <li><strong>Assembly</strong> — instance and position parts</li>
          <li><strong>Step</strong> — define analysis steps (Static General, Dynamic Explicit, Heat Transfer, etc.)</li>
          <li><strong>Interaction</strong> — contact pairs, constraints, connectors, ties</li>
          <li><strong>Load</strong> — forces, pressures, displacement BCs, temperature fields</li>
          <li><strong>Mesh</strong> — element type (C3D8R, S4R, etc.), seed density, sweep/structured meshing</li>
          <li><strong>Job</strong> — submit, monitor convergence, check warnings in <Box component="span" className="frost-code">.msg</Box> file</li>
          <li><strong>Visualization</strong> — deformed shape, stress/strain contours, animations via ODB file</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Running via Command Line</Typography>
        <Typography className="frost-p">
          Abaqus jobs can be submitted without the GUI — useful for batch runs on servers:
        </Typography>
        <Box component="pre" className="frost-pre">{`# Run a job (model.inp → model.odb results)
abaqus job=model cpus=4 interactive

# Check job status
abaqus job=model status

# Open results in Viewer
abaqus viewer odb=model.odb`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Box component="ul" className="frost-ul">
          <li>3DS Learning (SIMULIA) — official courses at <Box component="span" className="frost-code">3ds.com/support/learning</Box></li>
          <li>Abaqus documentation — Getting Started with Abaqus: Interactive Edition (PDF bundled with install)</li>
          <li>iMechanica forum — active FEA community with Abaqus-specific threads</li>
          <li>YouTube: &quot;Abaqus Tutorial&quot; — many university-published step-by-step guides</li>
        </Box>
      </Box>
    </FrostContentPage>
  );
}
