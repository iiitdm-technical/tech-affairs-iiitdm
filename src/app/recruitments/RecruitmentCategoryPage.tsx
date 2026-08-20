"use client";

import { Box, Button, Container, Typography, alpha } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";
import { recruitments, type RecruitmentCategory } from "@/lib/data/content";

export default function RecruitmentCategoryPage({ category }: { category: RecruitmentCategory }) {
  const { isDarkMode } = useThemeContext();
  const content = recruitments.categories[category];
  const isOpen = Boolean(content.actionUrl);

  return (
    <Box className={isDarkMode ? "grids-dark" : "grids-light"} sx={{ minHeight: "100vh", pt: { xs: 15, md: 20 }, pb: 8 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Button
            component={Link}
            href="/recruitments"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4, color: "text.secondary", borderRadius: 2, px: 2, "&:hover": { bgcolor: alpha(content.color, isDarkMode ? 0.1 : 0.05), color: content.color } }}
          >
            Back to Recruitments
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: content.color, letterSpacing: "-0.04em" }}>
              {content.title}
            </Typography>
            <Box sx={{ display: "inline-flex", px: 1.5, py: 0.5, borderRadius: 1, bgcolor: alpha(content.color, 0.1), color: content.color, fontSize: "0.875rem", fontWeight: 700, border: `1px solid ${alpha(content.color, 0.2)}` }}>
              Status: {content.status}
            </Box>
          </Box>

          <Box sx={{ p: { xs: 4, md: 8 }, borderRadius: 6, bgcolor: isDarkMode ? alpha("#ffffff", 0.03) : alpha("#ffffff", 0.7), backdropFilter: "blur(20px)", border: "1px solid", borderColor: isDarkMode ? alpha("#ffffff", 0.08) : alpha("#000000", 0.05), textAlign: "center" }}>
            <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: alpha(content.color, 0.1), color: content.color, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>{content.symbol}</Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{content.heading}</Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary", maxWidth: 450, mx: "auto", lineHeight: 1.7 }}>
              {content.description}
            </Typography>
            <Button
              variant={isOpen ? "contained" : "outlined"}
              href={content.actionUrl}
              target={isOpen ? "_blank" : undefined}
              rel={isOpen ? "noopener noreferrer" : undefined}
              disabled={!isOpen}
              sx={{ bgcolor: isOpen ? content.color : undefined, color: isOpen ? "#fff" : undefined, borderRadius: 3, px: 4, py: 1.2, textTransform: "none", fontWeight: 600, "&:hover": isOpen ? { bgcolor: alpha(content.color, 0.8) } : undefined }}
            >
              {content.actionLabel}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
