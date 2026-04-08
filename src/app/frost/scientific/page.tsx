"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Card, CardContent, Button, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";
import { SiOctave, SiPython, SiR } from "react-icons/si";
import { BsGpuCard } from "react-icons/bs";

const SECTIONS = [
  {
    title: "Engineering & CAD",
    color: "#a3e635",
    icon: <BsGpuCard size={28} />,
    items: [
      { name: "ANSYS",       desc: "Multiphysics simulation — FEA, CFD, structural analysis." },
      { name: "Abaqus",      desc: "Advanced finite element analysis for complex simulations." },
      { name: "SolidWorks",  desc: "3D CAD design — parts, assemblies, drawings." },
      { name: "AutoCAD",     desc: "Industry-standard 2D/3D drafting and design." },
    ],
  },
  {
    title: "Numerical Computing",
    color: "#f59e0b",
    icon: <SiOctave size={28} />,
    items: [
      { name: "MATLAB",       desc: "High-level language for numerical computation and visualization." },
      { name: "COMSOL",       desc: "Multiphysics simulation with coupled physics models." },
      { name: "Intel Compilers", desc: "Optimized compilers for high-performance scientific code." },
      { name: "PGI Compilers",   desc: "High-performance Fortran / C / C++ compilers." },
    ],
  },
  {
    title: "Data & Materials",
    color: "#4ade80",
    icon: <SiPython size={28} />,
    items: [
      { name: "Materials Studio", desc: "Molecular modeling and materials simulation platform." },
      { name: "Python (Scientific)", desc: "NumPy, SciPy, pandas, matplotlib — the full scientific stack." },
      { name: "R",              desc: "Statistical computing and graphics environment." },
    ],
  },
];

const ALL_TOOLS = ["ANSYS", "MATLAB", "COMSOL", "Abaqus", "SolidWorks", "AutoCAD", "Materials Studio", "Python", "R", "Intel Compilers"];

export default function ScientificPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Button component={Link} href="/frost" startIcon={<ArrowBack />} size="small"
            sx={{ mb: 4, color: "text.secondary", "&:hover": { color: "primary.main" } }}>
            Back to FROST
          </Button>

          <Typography variant="h3" fontWeight={900} letterSpacing="-0.04em" mb={1.5}
            sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
            Scientific Software
          </Typography>
          <Typography color="text.secondary" mb={3} maxWidth={580} lineHeight={1.75}>
            Research-grade simulation, CAD, and numerical computing tools available for IIITDM faculty and students.
          </Typography>

          {/* Quick tag cloud */}
          <Box display="flex" flexWrap="wrap" gap={0.75} mb={6}>
            {ALL_TOOLS.map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined"
                sx={{ fontSize: "0.72rem", borderColor: "rgba(163,230,53,0.25)", color: "text.secondary" }} />
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 3 }}>
            {SECTIONS.map((section, i) => (
              <motion.div key={section.title}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}>
                <Card sx={{
                  height: "100%", display: "flex", flexDirection: "column",
                  bgcolor: isDark ? "rgba(5,46,22,0.45)" : "background.paper",
                  border: `1px solid ${isDark ? "rgba(163,230,53,0.1)" : "rgba(0,0,0,0.08)"}`,
                  borderRadius: 3, transition: "all 0.22s",
                  "&:hover": {
                    borderColor: section.color,
                    boxShadow: isDark ? `0 8px 28px -4px ${section.color}18` : "0 8px 24px -4px rgba(0,0,0,0.1)",
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 52, height: 52, borderRadius: 2, mb: 2.5,
                      bgcolor: `${section.color}14`, color: section.color,
                    }}>
                      {section.icon}
                    </Box>
                    <Typography fontWeight={800} fontSize="1rem" mb={2.5} letterSpacing="-0.01em">
                      {section.title}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1.5}>
                      {section.items.map((item) => (
                        <Box key={item.name}>
                          <Typography fontSize="0.85rem" fontWeight={650} mb={0.25}>
                            {item.name}
                          </Typography>
                          <Typography fontSize="0.78rem" color="text.secondary" lineHeight={1.6}>
                            {item.desc}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>

          {/* Contact note */}
          <Box mt={5} p={2.5} sx={{
            borderRadius: 2,
            bgcolor: isDark ? "rgba(163,230,53,0.05)" : "rgba(22,163,74,0.04)",
            border: `1px solid ${isDark ? "rgba(163,230,53,0.12)" : "rgba(22,163,74,0.12)"}`,
          }}>
            <Typography fontSize="0.875rem" color="text.secondary" lineHeight={1.75}>
              <strong style={{ color: "#a3e635" }}>Access:</strong> Licensed software is available on department lab machines. For personal device installation or license keys, contact the CSC Helpdesk with your IIITDM ID.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
