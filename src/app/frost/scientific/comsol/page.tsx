"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function ComsolPage() {
  return (
    <FrostContentPage
      title="COMSOL Multiphysics"
      subtitle="Coupled physics simulation — model heat transfer, fluid flow, structural mechanics, and electromagnetics all in one unified environment."
      backHref="/frost/scientific"
      backLabel="Back to Scientific Software"
      breadcrumbs={[{ label: "FROST", href: "/frost" }, { label: "Scientific", href: "/frost/scientific" }]}
      accentColor="#4ade80"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">What is COMSOL?</Typography>
        <Typography className="frost-p">
          COMSOL Multiphysics is a finite element analysis software platform specializing in <strong>multiphysics coupling</strong> —
          simulating systems where multiple physical phenomena interact simultaneously (e.g., Joule heating causes thermal expansion
          which changes electrical resistance). This makes it uniquely suited for MEMS, microfluidics, electrochemistry, and RF devices.
        </Typography>
        <Typography className="frost-p">
          COMSOL is built around a unified model tree — geometry, materials, physics, mesh, and study all in one interface.
          Results can be exported to MATLAB via LiveLink for further processing.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download & Install</Typography>
        <Box component="ol" className="frost-ul" sx={{ listStyleType: "decimal" }}>
          <li>Get the campus license server details from CSC (FlexLM format: <Box component="span" className="frost-code">1718@licserver.iiitdm.ac.in</Box>)</li>
          <li>Download the installer from <Box component="span" className="frost-code">comsol.com/product-download</Box> using your institutional account, or from the CSC file server</li>
          <li>Run the installer — choose <strong>Custom installation</strong> to select only needed modules</li>
          <li>On the license page, select <strong>COMSOL License Manager</strong> and enter the server address</li>
          <li>Install MATLAB (optional but recommended) before COMSOL if you want LiveLink integration</li>
        </Box>
        <Box className="frost-note">
          Only install modules you need — a full install with all add-on modules can exceed 25 GB.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Key Add-on Modules</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>Heat Transfer Module</strong> — conduction, convection, radiation, phase change</li>
          <li><strong>CFD Module</strong> — laminar and turbulent flow, non-Newtonian fluids</li>
          <li><strong>Structural Mechanics Module</strong> — static, dynamic, fatigue, contact mechanics</li>
          <li><strong>AC/DC Module</strong> — electrostatics, magnetostatics, circuit simulation</li>
          <li><strong>RF Module</strong> — microwave, antenna design, S-parameters</li>
          <li><strong>MEMS Module</strong> — microelectromechanical systems, piezoelectrics</li>
          <li><strong>Chemical Reaction Engineering Module</strong> — reactor design, mass transport</li>
          <li><strong>LiveLink for MATLAB</strong> — run COMSOL models from MATLAB scripts</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Basic Workflow</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>Model Wizard</strong> — select space dimension (1D/2D/3D/axisymmetric) and add physics interfaces</li>
          <li><strong>Geometry</strong> — build with primitives or import CAD (STEP, DXF, STL)</li>
          <li><strong>Materials</strong> — assign from built-in library or define custom material properties</li>
          <li><strong>Physics</strong> — set governing equations, boundary conditions, initial values</li>
          <li><strong>Mesh</strong> — auto mesh or manually control element size per domain/boundary</li>
          <li><strong>Study</strong> — choose solver type: Stationary, Time Dependent, Eigenfrequency, Parametric Sweep</li>
          <li><strong>Results</strong> — surface/volume plots, streamlines, animations, derived quantities</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">System Requirements</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>OS:</strong> Windows 10/11, macOS 12+, or Linux (RHEL/Ubuntu)</li>
          <li><strong>RAM:</strong> 4 GB minimum — 16 GB+ for 3D models</li>
          <li><strong>Disk:</strong> 8–25 GB depending on modules installed</li>
          <li><strong>Display:</strong> OpenGL 3.2 capable GPU required for 3D visualization</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Box component="ul" className="frost-ul">
          <li>COMSOL Learning Center — free tutorials and videos at <Box component="span" className="frost-code">comsol.com/learning-center</Box></li>
          <li>Application Gallery — 2000+ ready-to-run models at <Box component="span" className="frost-code">comsol.com/models</Box></li>
          <li>COMSOL Blog — in-depth articles on simulation techniques and physics</li>
          <li>Built-in documentation: Help → Documentation inside COMSOL Desktop</li>
        </Box>
      </Box>
    </FrostContentPage>
  );
}
