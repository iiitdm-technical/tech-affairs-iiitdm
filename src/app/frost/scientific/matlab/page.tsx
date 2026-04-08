"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function MatlabPage() {
  return (
    <FrostContentPage
      title="MATLAB"
      subtitle="Matrix laboratory — the go-to environment for numerical computation, signal processing, control systems, and algorithm development."
      backHref="/frost/scientific"
      backLabel="Back to Scientific Software"
      breadcrumbs={[{ label: "FROST", href: "/frost" }, { label: "Scientific", href: "/frost/scientific" }]}
      accentColor="#f59e0b"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">What is MATLAB?</Typography>
        <Typography className="frost-p">
          MATLAB (Matrix Laboratory) is a proprietary programming language and numeric computing environment by MathWorks.
          It is widely used in engineering, physics, economics, and applied mathematics for data analysis, algorithm prototyping,
          simulation, and visualization. MATLAB code is interpreted and matrix-native — no boilerplate needed for array operations.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download & Install</Typography>
        <Typography className="frost-p">
          IIITDM has a campus license. The general process for institutional access:
        </Typography>
        <Box component="ol" className="frost-ul" sx={{ listStyleType: "decimal" }}>
          <li>Contact CSC or your department to get a MathWorks license activation key linked to your institutional email</li>
          <li>Create a MathWorks account at <Box component="span" className="frost-code">mathworks.com</Box> using your <Box component="span" className="frost-code">@iiitdm.ac.in</Box> email</li>
          <li>Associate the license key with your account under My Account → License Center</li>
          <li>Download the installer for your OS (Windows / macOS / Linux) from the MathWorks portal</li>
          <li>Run the installer — sign in to your MathWorks account — select the toolboxes you need</li>
        </Box>
        <Box className="frost-note">
          Minimum requirements: 4 GB RAM (8 GB recommended), 3–4 GB disk space per toolbox. A 64-bit OS is required for MATLAB R2020a and later.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Essential Toolboxes</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>Signal Processing Toolbox</strong> — FFT, filter design, spectral analysis</li>
          <li><strong>Control System Toolbox</strong> — PID design, Bode/Nyquist plots, state-space</li>
          <li><strong>Image Processing Toolbox</strong> — filtering, morphology, feature detection</li>
          <li><strong>Statistics and Machine Learning Toolbox</strong> — regression, classification, clustering</li>
          <li><strong>Symbolic Math Toolbox</strong> — symbolic differentiation, integration, equation solving</li>
          <li><strong>Optimization Toolbox</strong> — linear/nonlinear programming, genetic algorithms</li>
          <li><strong>Deep Learning Toolbox</strong> — CNNs, RNNs, transfer learning</li>
          <li><strong>Simulink</strong> — block-diagram simulation for dynamic systems</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Quick Start</Typography>
        <Typography className="frost-p">Basic MATLAB workflow:</Typography>
        <Box component="pre" className="frost-pre">{`% Define a matrix
A = [1 2 3; 4 5 6; 7 8 9];

% Element-wise operations
B = A .^ 2;

% Plot
x = 0:0.01:2*pi;
plot(x, sin(x));
title('Sine Wave'); xlabel('x'); ylabel('sin(x)');

% Solve linear system Ax = b
b = [1; 2; 3];
x = A \\ b;`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Free Alternative — GNU Octave</Typography>
        <Typography className="frost-p">
          GNU Octave is mostly syntax-compatible with MATLAB and is completely free. Good for learning and running basic MATLAB scripts
          without a license. Download from <Box component="span" className="frost-code">octave.org</Box>.
          Most core MATLAB scripts run unchanged; toolbox-specific functions differ.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Box component="ul" className="frost-ul">
          <li>MathWorks MATLAB Onramp — free interactive course at <Box component="span" className="frost-code">matlabacademy.mathworks.com</Box></li>
          <li>Official documentation: <Box component="span" className="frost-code">mathworks.com/help/matlab</Box></li>
          <li>MATLAB Central File Exchange — thousands of community-contributed functions and examples</li>
        </Box>
      </Box>
    </FrostContentPage>
  );
}
