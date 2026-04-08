"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function MaterialsStudioPage() {
  return (
    <FrostContentPage
      title="Materials Studio"
      subtitle="Molecular modeling and simulation platform for chemistry, materials science, and drug discovery research."
      backHref="/frost/scientific"
      backLabel="Back to Scientific Software"
      breadcrumbs={[{ label: "FROST", href: "/frost" }, { label: "Scientific", href: "/frost/scientific" }]}
      accentColor="#f472b6"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">What is Materials Studio?</Typography>
        <Typography className="frost-p">
          Materials Studio (by Dassault Systèmes BIOVIA) is a simulation environment for materials modeling at the atomic and molecular scale.
          It combines quantum mechanics (DFT), molecular dynamics, Monte Carlo, and mesoscale methods in one platform — used in
          polymer research, catalysis, crystal engineering, battery materials, and pharmaceutical development.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download & Install</Typography>
        <Box component="ol" className="frost-ul" sx={{ listStyleType: "decimal" }}>
          <li>Obtain the BIOVIA license server details from CSC (FLEXlm format)</li>
          <li>Download the installer from the BIOVIA customer portal or campus file server</li>
          <li>Run the Windows installer (Materials Studio is Windows-only for the GUI; servers can run Linux)</li>
          <li>During install, point to the campus license server</li>
          <li>Install only the modules licensed — each module (CASTEP, Forcite, etc.) uses separate license tokens</li>
        </Box>
        <Box className="frost-warning">
          Materials Studio GUI runs only on Windows. Computational jobs can be offloaded to a Linux server via the built-in job gateway.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Key Simulation Modules</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>CASTEP</strong> — plane-wave DFT for electronic structure, phonons, band gaps, optical properties</li>
          <li><strong>DMol³</strong> — DFT with localized basis sets; molecular and periodic systems</li>
          <li><strong>Forcite</strong> — classical molecular dynamics and energy minimization with force fields</li>
          <li><strong>GULP</strong> — lattice dynamics and energy minimization for ionic/covalent materials</li>
          <li><strong>Amorphous Cell</strong> — build and analyze amorphous polymer/glass structures</li>
          <li><strong>Polymorph</strong> — crystal structure prediction from molecular structure</li>
          <li><strong>VAMP</strong> — semi-empirical quantum mechanics (AM1, PM3, MNDO)</li>
          <li><strong>Adsorption Locator</strong> — surface adsorption sites via Monte Carlo</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Typical Workflow</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>Build</strong> — construct molecule, crystal, surface slab, or polymer chain using the 3D Sketcher</li>
          <li><strong>Clean</strong> — geometry optimize with a quick force field to remove bad contacts</li>
          <li><strong>Calculate</strong> — choose a module and set up calculation parameters (functional, k-points, cutoff energy for DFT)</li>
          <li><strong>Run</strong> — submit locally or to a remote server via Job Gateway</li>
          <li><strong>Analyze</strong> — view results: band structure, DOS, RDF, MSD, energy convergence</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Free Open-Source Alternatives</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>VESTA</strong> — crystal structure visualization and analysis (free, widely used)</li>
          <li><strong>Quantum ESPRESSO</strong> — plane-wave DFT, equivalent to CASTEP (free, Linux)</li>
          <li><strong>LAMMPS</strong> — classical molecular dynamics (free, highly scalable)</li>
          <li><strong>GROMACS / NAMD</strong> — biomolecular MD simulations (free)</li>
          <li><strong>ASE</strong> (Atomic Simulation Environment) — Python library interfacing many DFT codes</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Box component="ul" className="frost-ul">
          <li>BIOVIA Materials Studio Tutorials — bundled with installation under Help → Tutorials</li>
          <li>CASTEP Workshop materials — free lecture notes and exercises at <Box component="span" className="frost-code">castep.org</Box></li>
          <li>ResearchGate / forums — active community for specific module questions</li>
          <li>YouTube: search &quot;Materials Studio tutorial CASTEP&quot; for step-by-step DFT walkthroughs</li>
        </Box>
      </Box>
    </FrostContentPage>
  );
}
