"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function PythonPage() {
  return (
    <FrostContentPage
      title="Python (Scientific)"
      subtitle="Free, open-source, and the most widely used language in scientific computing — from data analysis to machine learning."
      backHref="/frost/scientific"
      backLabel="Back to Scientific Software"
      breadcrumbs={[{ label: "FROST", href: "/frost" }, { label: "Scientific", href: "/frost/scientific" }]}
      accentColor="#60a5fa"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">Why Python for Science?</Typography>
        <Typography className="frost-p">
          Python has become the dominant language for scientific computing, data science, and machine learning due to its
          readable syntax, massive ecosystem of libraries, and seamless integration with C/Fortran performance code.
          It is completely free and runs on all platforms.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Install Python</Typography>
        <Typography className="frost-p">
          The recommended way for scientific work is <strong>Anaconda</strong> or <strong>Miniconda</strong> — they bundle Python
          with conda package manager and most scientific libraries pre-installed.
        </Typography>
        <Box component="ol" className="frost-ul" sx={{ listStyleType: "decimal" }}>
          <li>Download Anaconda from <Box component="span" className="frost-code">anaconda.com/download</Box> (includes everything) or Miniconda from <Box component="span" className="frost-code">docs.conda.io</Box> (minimal, install only what you need)</li>
          <li>Run the installer — on Linux: <Box component="span" className="frost-code">bash Anaconda3-*.sh</Box></li>
          <li>Restart terminal. Verify: <Box component="span" className="frost-code">python --version</Box></li>
          <li>Create isolated environments per project to avoid dependency conflicts</li>
        </Box>
        <Box component="pre" className="frost-pre">{`# Create a new environment
conda create -n research python=3.11

# Activate it
conda activate research

# Install scientific stack
conda install numpy scipy matplotlib pandas jupyter scikit-learn`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Core Scientific Libraries</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>NumPy</strong> — N-dimensional arrays, linear algebra, FFT, random number generation</li>
          <li><strong>SciPy</strong> — integration, optimization, interpolation, signal processing, statistics</li>
          <li><strong>pandas</strong> — DataFrame-based data manipulation, CSV/Excel I/O, time series</li>
          <li><strong>matplotlib</strong> — 2D/3D plotting, publication-quality figures</li>
          <li><strong>Seaborn</strong> — statistical visualization built on matplotlib</li>
          <li><strong>SymPy</strong> — symbolic mathematics (differentiation, integration, equation solving)</li>
          <li><strong>scikit-learn</strong> — machine learning: classification, regression, clustering, preprocessing</li>
          <li><strong>TensorFlow / PyTorch</strong> — deep learning frameworks</li>
          <li><strong>OpenCV</strong> — computer vision and image processing</li>
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Jupyter Notebooks</Typography>
        <Typography className="frost-p">
          Jupyter Notebook / JupyterLab is the standard interactive environment for scientific Python — mix code, equations (LaTeX), plots, and markdown in one document.
        </Typography>
        <Box component="pre" className="frost-pre">{`# Install and launch JupyterLab
pip install jupyterlab
jupyter lab

# Or classic notebook
jupyter notebook`}</Box>
        <Typography className="frost-p">
          VS Code also has excellent Jupyter support via the Python extension — recommended for larger projects.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Quick Example</Typography>
        <Box component="pre" className="frost-pre">{`import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint

# Solve ODE: dy/dt = -2y
def model(y, t):
    return -2 * y

t = np.linspace(0, 5, 100)
y = odeint(model, y0=5, t=t)

plt.plot(t, y)
plt.xlabel('Time'); plt.ylabel('y(t)')
plt.title('Exponential Decay'); plt.show()`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Box component="ul" className="frost-ul">
          <li>NumPy quickstart: <Box component="span" className="frost-code">numpy.org/doc/stable/user/quickstart</Box></li>
          <li>SciPy lectures: <Box component="span" className="frost-code">scipy-lectures.org</Box> — comprehensive free textbook</li>
          <li>Kaggle Learn — free micro-courses on pandas, ML, deep learning</li>
          <li>Python for Data Analysis (book by Wes McKinney, pandas author)</li>
          <li>Real Python — <Box component="span" className="frost-code">realpython.com</Box> — practical tutorials</li>
        </Box>
      </Box>
    </FrostContentPage>
  );
}
