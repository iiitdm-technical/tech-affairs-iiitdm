"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Button, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface FrostContentPageProps {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
  breadcrumbs?: BreadcrumbItem[];
  accentColor?: string;
  children: React.ReactNode;
}

export default function FrostContentPage({
  title,
  subtitle,
  backHref,
  backLabel,
  breadcrumbs,
  accentColor = "#a3e635",
  children,
}: FrostContentPageProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          {/* Back button */}
          <Button component={Link} href={backHref} startIcon={<ArrowBack />} size="small"
            sx={{ mb: breadcrumbs ? 1.5 : 4, color: "text.secondary", "&:hover": { color: "primary.main" } }}>
            {backLabel}
          </Button>

          {/* Breadcrumbs */}
          {breadcrumbs && (
            <Box display="flex" alignItems="center" gap={0.75} mb={4} flexWrap="wrap">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  <Typography
                    component={Link} href={crumb.href}
                    fontSize="0.8rem" color="text.disabled"
                    sx={{ textDecoration: "none", "&:hover": { color: accentColor } }}>
                    {crumb.label}
                  </Typography>
                  {i < breadcrumbs.length - 1 && (
                    <Typography fontSize="0.8rem" color="text.disabled">/</Typography>
                  )}
                </React.Fragment>
              ))}
              <Typography fontSize="0.8rem" color="text.disabled">/</Typography>
              <Typography fontSize="0.8rem" sx={{ color: accentColor }}>{title}</Typography>
            </Box>
          )}

          {/* Header */}
          <Box mb={5}>
            <Typography variant="h3" fontWeight={900} letterSpacing="-0.04em" mb={1.5}
              sx={{
                fontSize: { xs: "1.9rem", md: "2.6rem" },
                background: isDark
                  ? `linear-gradient(135deg, ${accentColor}, #fff)`
                  : `linear-gradient(135deg, #16a34a, ${accentColor})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography color="text.secondary" fontSize="1rem" maxWidth={600} lineHeight={1.75}>
                {subtitle}
              </Typography>
            )}
            <Divider sx={{
              mt: 3,
              borderColor: isDark ? `${accentColor}30` : `${accentColor}60`,
              borderWidth: 1.5,
              maxWidth: 80,
              borderRadius: 2,
            }} />
          </Box>

          {/* Content */}
          <Box
            sx={{
              "& .frost-section": {
                mb: 5,
              },
              "& .frost-h2": {
                fontSize: { xs: "1.15rem", md: "1.3rem" },
                fontWeight: 700,
                mb: 1.5,
                mt: 0,
                color: accentColor,
                letterSpacing: "-0.01em",
              },
              "& .frost-h3": {
                fontSize: "1rem",
                fontWeight: 650,
                mb: 1,
                mt: 0,
                color: isDark ? "rgba(163,230,53,0.7)" : "#16a34a",
              },
              "& .frost-p": {
                fontSize: "0.925rem",
                color: "text.secondary",
                lineHeight: 1.8,
                mb: 1.5,
              },
              "& .frost-code": {
                fontFamily: "monospace",
                fontSize: "0.85rem",
                px: 1, py: 0.25,
                borderRadius: 0.75,
                bgcolor: isDark ? "rgba(163,230,53,0.08)" : "rgba(22,163,74,0.06)",
                color: accentColor,
                border: `1px solid ${isDark ? "rgba(163,230,53,0.15)" : "rgba(22,163,74,0.2)"}`,
              },
              "& .frost-pre": {
                fontFamily: "monospace",
                fontSize: "0.85rem",
                p: 2.5,
                borderRadius: 2,
                overflowX: "auto",
                bgcolor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(163,230,53,0.12)" : "rgba(0,0,0,0.1)"}`,
                color: accentColor,
                mb: 2,
                whiteSpace: "pre",
              },
              "& .frost-link": {
                color: accentColor,
                textDecoration: "none",
                borderBottom: `1px solid ${accentColor}40`,
                transition: "border-color 0.15s",
                "&:hover": { borderBottomColor: accentColor },
              },
              "& .frost-ul": {
                pl: 2.5,
                mb: 1.5,
                "& li": {
                  fontSize: "0.925rem",
                  color: "text.secondary",
                  lineHeight: 1.8,
                  mb: 0.5,
                  "&::marker": { color: accentColor },
                },
              },
              "& .frost-warning": {
                p: 2,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.06)",
                border: `1px solid rgba(245,158,11,0.25)`,
                color: "#f59e0b",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                mb: 2,
              },
              "& .frost-note": {
                p: 2,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(163,230,53,0.06)" : "rgba(22,163,74,0.04)",
                border: `1px solid ${isDark ? "rgba(163,230,53,0.15)" : "rgba(22,163,74,0.15)"}`,
                color: "text.secondary",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                mb: 2,
              },
            }}
          >
            {children}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
