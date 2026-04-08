"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Card, CardContent, Button, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Terminal, Window, Science, ArrowForward } from "@mui/icons-material";

const SECTIONS = [
  {
    title: "Linux",
    slug: "linux",
    icon: <Terminal sx={{ fontSize: 40 }} />,
    color: "#a3e635",
    description: "Ubuntu, Debian, Linux Mint, Gentoo and more open-source distributions.",
    items: ["Ubuntu", "Debian", "Linux Mint", "Gentoo"],
  },
  {
    title: "Windows",
    slug: "windows",
    icon: <Window sx={{ fontSize: 40 }} />,
    color: "#4ade80",
    description: "Microsoft Office 365, Windows OS, Teams, Adobe and other licensed software.",
    items: ["Office 365", "Windows OS", "MS Teams", "Adobe"],
  },
  {
    title: "Scientific",
    slug: "scientific",
    icon: <Science sx={{ fontSize: 40 }} />,
    color: "#f59e0b",
    description: "ANSYS, MATLAB, COMSOL, Abaqus and other research-grade tools.",
    items: ["ANSYS", "MATLAB", "COMSOL", "Abaqus"],
  },
];

export default function FrostPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <Box textAlign="center" mb={8}>
            <Chip label="Software Distribution" size="small"
              sx={{
                mb: 2, fontWeight: 650, letterSpacing: "0.1em", fontSize: "0.7rem",
                bgcolor: isDark ? "rgba(163,230,53,0.1)" : "rgba(22,163,74,0.1)",
                color: "primary.main", border: "1px solid", borderColor: "primary.main",
              }} />
            <Typography variant="h2" fontWeight={900} letterSpacing="-0.04em"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                background: isDark
                  ? "linear-gradient(135deg, #a3e635, #4ade80)"
                  : "linear-gradient(135deg, #16a34a, #a3e635)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", mb: 2,
              }}>
              FROST
            </Typography>
            <Typography color="text.secondary" fontSize="1.05rem" maxWidth={620} mx="auto" lineHeight={1.75}>
              Free and licensed software distributions for the IIITDM community — Linux, Windows, and Scientific tools.
            </Typography>
          </Box>

          {/* Section cards */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
            {SECTIONS.map((section, i) => (
              <motion.div key={section.slug} style={{ flex: 1 }}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}>
                <Card component={Link} href={`/frost/${section.slug}`}
                  sx={{
                    height: "100%", display: "flex", flexDirection: "column",
                    textDecoration: "none", cursor: "pointer",
                    bgcolor: isDark ? "rgba(5,46,22,0.45)" : "background.paper",
                    border: `1px solid ${isDark ? "rgba(163,230,53,0.1)" : "rgba(0,0,0,0.08)"}`,
                    borderRadius: 3, transition: "all 0.25s",
                    "&:hover": {
                      borderColor: section.color,
                      transform: "translateY(-4px)",
                      boxShadow: isDark
                        ? `0 12px 32px -4px ${section.color}25`
                        : `0 12px 32px -4px rgba(0,0,0,0.15)`,
                    },
                  }}>
                  <CardContent sx={{ p: 3.5, flexGrow: 1 }}>
                    {/* Icon */}
                    <Box sx={{
                      width: 64, height: 64, borderRadius: 2.5, mb: 2.5,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      bgcolor: `${section.color}15`,
                      color: section.color,
                    }}>
                      {section.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={800} mb={1} letterSpacing="-0.02em">
                      {section.title}
                    </Typography>
                    <Typography color="text.secondary" fontSize="0.9rem" lineHeight={1.65} mb={2.5}>
                      {section.description}
                    </Typography>
                    {/* Item chips */}
                    <Box display="flex" flexWrap="wrap" gap={0.75} mb={3}>
                      {section.items.map((item) => (
                        <Chip key={item} label={item} size="small" variant="outlined"
                          sx={{
                            fontSize: "0.7rem", height: 22,
                            borderColor: `${section.color}40`, color: section.color,
                          }} />
                      ))}
                      <Chip label="+ more" size="small"
                        sx={{ fontSize: "0.7rem", height: 22, color: "text.secondary" }} />
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}
                      sx={{ color: section.color, fontWeight: 600, fontSize: "0.875rem" }}>
                      View all <ArrowForward sx={{ fontSize: 16 }} />
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
