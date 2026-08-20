"use client";

import Link from "next/link";
import { ArrowForward, Science, Terminal, Window } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Container, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { frostCatalog, getFrostContributions } from "@/lib/data/frost";

const icons = {
  linux: <Terminal sx={{ fontSize: 40 }} />,
  windows: <Window sx={{ fontSize: 40 }} />,
  scientific: <Science sx={{ fontSize: 40 }} />,
};

export default function FrostPage() {
  const isDark = useTheme().palette.mode === "dark";
  const contributions = getFrostContributions("general");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box textAlign="center" mb={8}>
            <Chip label={frostCatalog.eyebrow} size="small" sx={{ mb: 2, fontWeight: 650, letterSpacing: "0.1em", fontSize: "0.7rem", bgcolor: isDark ? "rgba(125,211,252,0.1)" : "rgba(51,73,132,0.1)", color: "primary.main", border: "1px solid", borderColor: "primary.main" }} />
            <Typography variant="h2" fontWeight={900} letterSpacing="-0.04em"
              sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, background: isDark ? "linear-gradient(135deg, #7dd3fc, #93c5fd)" : "linear-gradient(135deg, #334984, #1f82b1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", mb: 2 }}>
              {frostCatalog.title}
            </Typography>
            <Typography color="text.secondary" fontSize="1.05rem" maxWidth={620} mx="auto" lineHeight={1.75}>
              {frostCatalog.description}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
            {frostCatalog.categories.map((section, index) => (
              <motion.div key={section.slug} style={{ flex: 1 }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.1 }}>
                <Card component={Link} href={`/frost/${section.slug}`} sx={{ height: "100%", display: "flex", flexDirection: "column", textDecoration: "none", bgcolor: isDark ? "rgba(16,37,74,0.45)" : "background.paper", border: `1px solid ${isDark ? "rgba(125,211,252,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 3, transition: "all 0.25s", "&:hover": { borderColor: section.color, transform: "translateY(-4px)", boxShadow: isDark ? `0 12px 32px -4px ${section.color}25` : "0 12px 32px -4px rgba(0,0,0,0.15)" } }}>
                  <CardContent sx={{ p: 3.5, flexGrow: 1 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: 2.5, mb: 2.5, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${section.color}15`, color: section.color }}>
                      {icons[section.icon as keyof typeof icons]}
                    </Box>
                    <Typography variant="h5" fontWeight={800} mb={1} letterSpacing="-0.02em">{section.title}</Typography>
                    <Typography color="text.secondary" fontSize="0.9rem" lineHeight={1.65} mb={2.5}>{section.description}</Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.75} mb={3}>
                      {section.summaryItems.map((item) => <Chip key={item} label={item} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 22, borderColor: `${section.color}40`, color: section.color }} />)}
                      <Chip label="+ more" size="small" sx={{ fontSize: "0.7rem", height: 22, color: "text.secondary" }} />
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ color: section.color, fontWeight: 600, fontSize: "0.875rem" }}>
                      View all <ArrowForward sx={{ fontSize: 16 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>

          <Box mt={10}>
            <Divider sx={{ mb: 6, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }} />
            <Box textAlign="center" mb={5}>
              <Typography variant="h4" fontWeight={900} letterSpacing="-0.03em" mb={1.5} sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" } }}>Community Contributions</Typography>
              <Typography color="text.secondary" fontSize="0.95rem" maxWidth={520} mx="auto" lineHeight={1.75}>
                Approved additions and corrections from the IIITDM community.
              </Typography>
            </Box>
            {contributions.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center", border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 3 }}>
                <Typography color="text.disabled" fontSize="0.875rem">No community contributions yet.</Typography>
              </Box>
            ) : contributions.map((entry) => (
              <Box key={entry.id} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                <Typography fontWeight={700} mb={0.75}>{entry.title}</Typography>
                <Typography color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>{entry.body}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
