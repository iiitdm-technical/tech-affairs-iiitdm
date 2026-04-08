"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { SiUbuntu, SiDebian, SiLinuxmint, SiGentoo } from "react-icons/si";

const DISTROS = [
  { title: "Ubuntu",      slug: "ubuntu",      icon: <SiUbuntu size={36} />,     color: "#f97316", desc: "The most popular Linux distro — beginner-friendly with LTS support and a huge community." },
  { title: "Debian",      slug: "debian",      icon: <SiDebian size={36} />,     color: "#a3e635", desc: "Rock-solid stability. The base of Ubuntu and many other distributions." },
  { title: "Linux Mint",  slug: "linux-mint",  icon: <SiLinuxmint size={36} />,  color: "#4ade80", desc: "Elegant and easy to use — great for newcomers switching from Windows." },
  { title: "Gentoo",      slug: "gentoo",      icon: <SiGentoo size={36} />,     color: "#86efac", desc: "Source-based distro for maximum control and performance tuning." },
];

export default function LinuxPage() {
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
            Linux Distributions
          </Typography>
          <Typography color="text.secondary" mb={6} maxWidth={560} lineHeight={1.75}>
            Open-source distributions mirrored and supported for the IIITDM community — from beginner-friendly to power-user.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2.5 }}>
            {DISTROS.map((item, i) => (
              <motion.div key={item.slug}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Card component={Link} href={`/frost/linux/${item.slug}`}
                  sx={{
                    height: "100%", display: "flex", flexDirection: "column",
                    textDecoration: "none",
                    bgcolor: isDark ? "rgba(5,46,22,0.45)" : "background.paper",
                    border: `1px solid ${isDark ? "rgba(163,230,53,0.1)" : "rgba(0,0,0,0.08)"}`,
                    borderRadius: 3, transition: "all 0.22s",
                    "&:hover": {
                      borderColor: item.color, transform: "translateY(-3px)",
                      boxShadow: isDark ? `0 8px 24px -4px ${item.color}20` : "0 8px 24px -4px rgba(0,0,0,0.12)",
                    },
                  }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ color: item.color, mb: 2 }}>{item.icon}</Box>
                    <Typography fontWeight={700} mb={0.75}>{item.title}</Typography>
                    <Typography color="text.secondary" fontSize="0.8rem" lineHeight={1.6} mb={2}>
                      {item.desc}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}
                      sx={{ color: item.color, fontWeight: 600, fontSize: "0.8rem" }}>
                      Learn more <ArrowForward sx={{ fontSize: 14 }} />
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
