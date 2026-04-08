"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowBack, ArrowForward, Window, Groups, Apps } from "@mui/icons-material";
import { SiAdobecreativecloud } from "react-icons/si";

const ITEMS = [
  { title: "Office 365",  slug: "office365", icon: <Apps sx={{ fontSize: 36 }} />,        color: "#a3e635", desc: "Word, Excel, PowerPoint and more — free with your IIITDM account." },
  { title: "Windows OS",  slug: "os",        icon: <Window sx={{ fontSize: 36 }} />,       color: "#4ade80", desc: "Licensed Windows OS available for students and faculty." },
  { title: "MS Teams",    slug: "teams",     icon: <Groups sx={{ fontSize: 36 }} />,       color: "#f59e0b", desc: "Online meetings, classes and collaboration through Teams." },
  { title: "Adobe Suite", slug: "adobe",     icon: <SiAdobecreativecloud size={36} />,     color: "#86efac", desc: "Adobe Creative Cloud — Photoshop, Illustrator, Premiere Pro and more." },
];

export default function WindowsPage() {
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
            Windows Software
          </Typography>
          <Typography color="text.secondary" mb={6} maxWidth={560} lineHeight={1.75}>
            Licensed Microsoft and Adobe software available free to all IIITDM students and faculty.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2.5 }}>
            {ITEMS.map((item, i) => (
              <motion.div key={item.slug}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Card component={Link} href={`/frost/windows/${item.slug}`}
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
