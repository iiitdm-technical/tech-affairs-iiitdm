"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Card, CardContent, Button, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { SiOctave, SiPython, SiR } from "react-icons/si";
import { TbAtom, TbChartHistogram, TbBuildingBridge } from "react-icons/tb";
import { GiMolecule } from "react-icons/gi";

const TOOLS = [
  {
    title: "MATLAB",
    slug: "matlab",
    icon: <SiOctave size={32} />,
    color: "#f59e0b",
    tag: "Numerical Computing",
    desc: "Matrix-based language for numerical computation, data analysis, and algorithm development.",
  },
  {
    title: "ANSYS",
    slug: "ansys",
    icon: <TbBuildingBridge size={32} />,
    color: "#a3e635",
    tag: "Simulation",
    desc: "Industry-leading FEA, CFD, and multiphysics simulation suite for engineering analysis.",
  },
  {
    title: "COMSOL",
    slug: "comsol",
    icon: <TbAtom size={32} />,
    color: "#4ade80",
    tag: "Multiphysics",
    desc: "Coupled physics simulation — thermal, structural, electrical, fluid in one model.",
  },
  {
    title: "Abaqus",
    slug: "abaqus",
    icon: <TbChartHistogram size={32} />,
    color: "#86efac",
    tag: "FEA",
    desc: "Advanced nonlinear finite element analysis for materials, structures, and crash simulations.",
  },
  {
    title: "Python",
    slug: "python",
    icon: <SiPython size={32} />,
    color: "#60a5fa",
    tag: "Scientific Computing",
    desc: "NumPy, SciPy, pandas, matplotlib — the complete open-source scientific computing stack.",
  },
  {
    title: "R",
    slug: "r",
    icon: <SiR size={32} />,
    color: "#818cf8",
    tag: "Statistics",
    desc: "Statistical computing and publication-quality graphics for data analysis and research.",
  },
  {
    title: "Materials Studio",
    slug: "materials-studio",
    icon: <GiMolecule size={32} />,
    color: "#f472b6",
    tag: "Materials Science",
    desc: "Molecular modeling, crystal structure prediction, and quantum chemistry simulations.",
  },
];

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
          <Typography color="text.secondary" mb={6} maxWidth={580} lineHeight={1.75}>
            Research-grade simulation, numerical computing, and data analysis tools — download guides and usage tips for each.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }, gap: 2.5 }}>
            {TOOLS.map((tool, i) => (
              <motion.div key={tool.slug}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}>
                <Card component={Link} href={`/frost/scientific/${tool.slug}`}
                  sx={{
                    height: "100%", display: "flex", flexDirection: "column",
                    textDecoration: "none",
                    bgcolor: isDark ? "rgba(5,46,22,0.45)" : "background.paper",
                    border: `1px solid ${isDark ? "rgba(163,230,53,0.1)" : "rgba(0,0,0,0.08)"}`,
                    borderRadius: 3, transition: "all 0.22s",
                    "&:hover": {
                      borderColor: tool.color, transform: "translateY(-3px)",
                      boxShadow: isDark ? `0 8px 24px -4px ${tool.color}20` : "0 8px 24px -4px rgba(0,0,0,0.1)",
                    },
                  }}>
                  <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box sx={{ color: tool.color, mb: 1.5 }}>{tool.icon}</Box>
                    <Chip label={tool.tag} size="small"
                      sx={{ alignSelf: "flex-start", mb: 1.25, fontSize: "0.65rem", height: 20,
                        bgcolor: `${tool.color}14`, color: tool.color, border: "none" }} />
                    <Typography fontWeight={700} mb={0.75}>{tool.title}</Typography>
                    <Typography color="text.secondary" fontSize="0.78rem" lineHeight={1.65} mb={2} flexGrow={1}>
                      {tool.desc}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}
                      sx={{ color: tool.color, fontWeight: 600, fontSize: "0.78rem" }}>
                      Download guide <ArrowForward sx={{ fontSize: 13 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
