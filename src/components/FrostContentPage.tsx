"use client";

import React from "react";
import Link from "next/link";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, Container, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import type { FrostBlock, FrostContribution, FrostGuide, FrostInline } from "@/lib/data/frost";

interface FrostContentPageProps {
  guide: FrostGuide;
  contributions: FrostContribution[];
}

function RichText({ content }: { content: FrostInline[] }) {
  return content.map((span, index) => {
    const text = span.bold ? <strong>{span.text}</strong> : span.text;

    if (span.code) {
      return <Box component="span" className="frost-code" key={index}>{text}</Box>;
    }

    if (span.href) {
      const external = /^https?:\/\//.test(span.href);
      return (
        <a
          className="frost-link"
          href={span.href}
          key={index}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {text}
        </a>
      );
    }

    return <React.Fragment key={index}>{text}</React.Fragment>;
  });
}

function ContentBlock({ block }: { block: FrostBlock }) {
  if (block.type === "heading") {
    return <Typography className="frost-h2">{block.text}</Typography>;
  }

  if (block.type === "code") {
    return <Box component="pre" className="frost-pre">{block.text}</Box>;
  }

  if (block.type === "list") {
    return (
      <Box component={block.ordered ? "ol" : "ul"} className="frost-ul">
        {block.items.map((item, index) => <li key={index}><RichText content={item} /></li>)}
      </Box>
    );
  }

  if (block.type === "note" || block.type === "warning") {
    return <Box className={`frost-${block.type}`}><RichText content={block.content} /></Box>;
  }

  return <Typography className="frost-p"><RichText content={block.content} /></Typography>;
}

export default function FrostContentPage({ guide, contributions }: FrostContentPageProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { accentColor, backHref, backLabel, breadcrumbs, blocks, subtitle, title } = guide;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Button component={Link} href={backHref} startIcon={<ArrowBack />} size="small"
            sx={{ mb: breadcrumbs.length ? 1.5 : 4, color: "text.secondary", "&:hover": { color: "primary.main" } }}>
            {backLabel}
          </Button>

          {breadcrumbs.length > 0 && (
            <Box display="flex" alignItems="center" gap={0.75} mb={4} flexWrap="wrap">
              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.href}>
                  <Typography component={Link} href={crumb.href} fontSize="0.8rem" color="text.disabled"
                    sx={{ textDecoration: "none", "&:hover": { color: accentColor } }}>
                    {crumb.label}
                  </Typography>
                  <Typography fontSize="0.8rem" color="text.disabled">/</Typography>
                </React.Fragment>
              ))}
              <Typography fontSize="0.8rem" sx={{ color: accentColor }}>{title}</Typography>
            </Box>
          )}

          <Box mb={5}>
            <Typography variant="h3" fontWeight={900} letterSpacing="-0.04em" mb={1.5}
              sx={{
                fontSize: { xs: "1.9rem", md: "2.6rem" },
                background: isDark
                  ? `linear-gradient(135deg, ${accentColor}, #fff)`
                  : `linear-gradient(135deg, #334984, ${accentColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {title}
            </Typography>
            <Typography color="text.secondary" fontSize="1rem" maxWidth={600} lineHeight={1.75}>
              {subtitle}
            </Typography>
            <Divider sx={{ mt: 3, borderColor: isDark ? `${accentColor}30` : `${accentColor}60`, borderWidth: 1.5, maxWidth: 80, borderRadius: 2 }} />
          </Box>

          <Box sx={{
            "& .frost-h2": {
              fontSize: { xs: "1.15rem", md: "1.3rem" }, fontWeight: 700,
              mb: 1.5, mt: 5, color: accentColor, letterSpacing: "-0.01em",
              "&:first-of-type": { mt: 0 },
            },
            "& .frost-p": { fontSize: "0.925rem", color: "text.secondary", lineHeight: 1.8, mb: 1.5 },
            "& .frost-code": {
              fontFamily: "monospace", fontSize: "0.85rem", px: 1, py: 0.25, borderRadius: 0.75,
              bgcolor: isDark ? "rgba(125,211,252,0.08)" : "rgba(51,73,132,0.06)", color: accentColor,
              border: `1px solid ${isDark ? "rgba(125,211,252,0.15)" : "rgba(51,73,132,0.2)"}`,
            },
            "& .frost-pre": {
              fontFamily: "monospace", fontSize: "0.85rem", p: 2.5, borderRadius: 2, overflowX: "auto",
              bgcolor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(125,211,252,0.12)" : "rgba(0,0,0,0.1)"}`,
              color: accentColor, mb: 2, whiteSpace: "pre",
            },
            "& .frost-link": {
              color: accentColor, textDecoration: "none", borderBottom: `1px solid ${accentColor}40`,
              transition: "border-color 0.15s", "&:hover": { borderBottomColor: accentColor },
            },
            "& .frost-ul": {
              pl: 2.5, mb: 1.5,
              "& li": { fontSize: "0.925rem", color: "text.secondary", lineHeight: 1.8, mb: 0.5, "&::marker": { color: accentColor } },
            },
            "& .frost-warning": {
              p: 2, borderRadius: 2, bgcolor: isDark ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b", fontSize: "0.875rem", lineHeight: 1.7, mb: 2,
            },
            "& .frost-note": {
              p: 2, borderRadius: 2, bgcolor: isDark ? "rgba(125,211,252,0.06)" : "rgba(51,73,132,0.04)",
              border: `1px solid ${isDark ? "rgba(125,211,252,0.15)" : "rgba(51,73,132,0.15)"}`,
              color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7, mb: 2,
            },
          }}>
            {blocks.map((block, index) => <ContentBlock block={block} key={index} />)}
          </Box>

          <Box mt={6}>
            <Divider sx={{ mb: 4, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
            <Box mb={3}>
              <Typography fontWeight={800} fontSize="1.1rem" letterSpacing="-0.02em">Community Contributions</Typography>
              <Typography variant="caption" color="text.secondary">
                Additions and corrections submitted by IIITDM students. All are reviewed before appearing here.
              </Typography>
            </Box>

            {contributions.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center", border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 3 }}>
                <Typography color="text.disabled" fontSize="0.875rem">No community contributions yet.</Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {contributions.map((contribution) => (
                  <Box key={contribution.id} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${isDark ? "rgba(125,211,252,0.1)" : "rgba(51,73,132,0.15)"}`, bgcolor: isDark ? "rgba(125,211,252,0.03)" : "rgba(51,73,132,0.02)" }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
                      <Avatar sx={{ width: 24, height: 24, fontSize: "0.65rem" }}>{contribution.author_name?.[0]?.toUpperCase()}</Avatar>
                      <Typography fontSize="0.8rem" fontWeight={600}>{contribution.author_name}</Typography>
                      <Typography fontSize="0.75rem" color="text.disabled">·</Typography>
                      <Typography fontSize="0.75rem" color="text.disabled">
                        {new Date(contribution.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </Typography>
                      <Chip icon={<CheckCircle sx={{ fontSize: "0.75rem !important" }} />} label="Verified" size="small"
                        sx={{ height: 18, fontSize: "0.62rem", ml: "auto", bgcolor: isDark ? "rgba(125,211,252,0.1)" : "rgba(51,73,132,0.1)", color: accentColor, "& .MuiChip-icon": { color: accentColor } }} />
                    </Box>
                    <Typography fontWeight={700} fontSize="0.9rem" mb={1}>{contribution.title}</Typography>
                    <Typography component="pre" sx={{ fontFamily: "inherit", fontSize: "0.875rem", color: "text.secondary", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", m: 0 }}>
                      {contribution.body}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
