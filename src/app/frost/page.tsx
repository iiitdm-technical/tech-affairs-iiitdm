"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box, Container, Typography, Card, CardContent, Button, Chip, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar,
  Snackbar, Alert, CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Terminal, Window, Science, ArrowForward, Add, Person, CheckCircle } from "@mui/icons-material";

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

const CATEGORIES = [
  "Linux / Open Source", "Windows", "Scientific Tools", "Networking / VPN",
  "Programming", "Dev Tools", "AI / ML", "Cloud / Servers", "Other",
];

interface Contribution {
  id: number;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
  page_title: string;
}

interface AuthUser {
  name: string;
  email: string;
  picture: string;
}

export default function FrostPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [recent, setRecent] = useState<Contribution[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Other", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success" | "error" }>({
    open: false, msg: "", sev: "success",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { setAuthUser(d); setAuthChecked(true); })
      .catch(() => setAuthChecked(true));

    // Load recent approved contributions across all pages
    fetch("/api/frost?page_path=general")
      .then(r => r.ok ? r.json() : [])
      .then(setRecent)
      .catch(() => {})
      .finally(() => setLoadingRecent(false));
  }, []);

  async function handleSubmit() {
    if (!form.title.trim() || !form.content.trim()) {
      setSnack({ open: true, msg: "Title and content are required", sev: "error" });
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/frost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path: "general",
        page_title: form.category,
        title: form.title,
        content: form.content,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setDialogOpen(false);
      setForm({ title: "", category: "Other", content: "" });
      setSnack({ open: true, msg: "Submitted! Your contribution will appear after admin review.", sev: "success" });
    } else {
      const d = await res.json().catch(() => ({}));
      setSnack({ open: true, msg: d.error || "Submission failed", sev: "error" });
    }
  }

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
                    <Box sx={{
                      width: 64, height: 64, borderRadius: 2.5, mb: 2.5,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      bgcolor: `${section.color}15`, color: section.color,
                    }}>
                      {section.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={800} mb={1} letterSpacing="-0.02em">
                      {section.title}
                    </Typography>
                    <Typography color="text.secondary" fontSize="0.9rem" lineHeight={1.65} mb={2.5}>
                      {section.description}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.75} mb={3}>
                      {section.items.map((item) => (
                        <Chip key={item} label={item} size="small" variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 22, borderColor: `${section.color}40`, color: section.color }} />
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

          {/* ── Community Contributions ── */}
          <Box mt={10}>
            <Divider sx={{ mb: 6, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }} />

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Box textAlign="center" mb={5}>
                <Typography variant="h4" fontWeight={900} letterSpacing="-0.03em" mb={1.5}
                  sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" }, color: "text.primary" }}>
                  Community Contributions
                </Typography>
                <Typography color="text.secondary" fontSize="0.95rem" maxWidth={520} mx="auto" lineHeight={1.75}>
                  Know a useful tip, setup guide, or fix for any tech tool? Share it with the IIITDM community.
                  Any genre — networking, dev tools, AI, cloud, or anything else.
                </Typography>

                <Box mt={3} display="flex" justifyContent="center">
                  {authChecked && (
                    authUser ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Add />}
                        onClick={() => setDialogOpen(true)}
                        sx={{
                          borderRadius: 3, px: 4, fontWeight: 700,
                          background: isDark
                            ? "linear-gradient(135deg, #16a34a, #a3e635)"
                            : "linear-gradient(135deg, #166534, #16a34a)",
                          color: isDark ? "#030a06" : "#f0fdf4",
                          boxShadow: "0 4px 18px -3px rgba(22,163,74,0.4)",
                          "&:hover": {
                            background: isDark
                              ? "linear-gradient(135deg, #15803d, #84cc16)"
                              : "linear-gradient(135deg, #14532d, #15803d)",
                          },
                        }}
                      >
                        Share a Tip or Guide
                      </Button>
                    ) : (
                      <Button
                        component={Link}
                        href="/login"
                        variant="outlined"
                        size="large"
                        startIcon={<Person />}
                        sx={{
                          borderRadius: 3, px: 4, fontWeight: 700,
                          borderColor: isDark ? "rgba(163,230,53,0.4)" : "rgba(22,163,74,0.4)",
                          color: isDark ? "#a3e635" : "#16a34a",
                          "&:hover": {
                            borderColor: isDark ? "#a3e635" : "#16a34a",
                            bgcolor: isDark ? "rgba(163,230,53,0.06)" : "rgba(22,163,74,0.06)",
                          },
                        }}
                      >
                        Sign in to contribute
                      </Button>
                    )
                  )}
                </Box>
              </Box>

              {/* Recent contributions */}
              {loadingRecent ? (
                <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} /></Box>
              ) : recent.length > 0 && (
                <Box>
                  <Typography fontSize="0.75rem" fontWeight={650} letterSpacing="0.1em"
                    textTransform="uppercase" color="text.disabled" mb={2}>
                    Recent contributions
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {recent.map((c) => (
                      <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Box sx={{
                          p: 2.5, borderRadius: 3,
                          border: `1px solid ${isDark ? "rgba(163,230,53,0.1)" : "rgba(22,163,74,0.12)"}`,
                          bgcolor: isDark ? "rgba(163,230,53,0.02)" : "rgba(22,163,74,0.015)",
                        }}>
                          <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
                            <Avatar sx={{ width: 26, height: 26, fontSize: "0.7rem", bgcolor: isDark ? "rgba(163,230,53,0.2)" : "rgba(22,163,74,0.15)", color: isDark ? "#a3e635" : "#16a34a" }}>
                              {c.author_name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Typography fontSize="0.82rem" fontWeight={600}>{c.author_name}</Typography>
                            <Typography fontSize="0.75rem" color="text.disabled">·</Typography>
                            <Chip label={c.page_title} size="small" variant="outlined"
                              sx={{ height: 18, fontSize: "0.65rem", borderColor: isDark ? "rgba(163,230,53,0.25)" : "rgba(22,163,74,0.3)", color: isDark ? "#a3e635" : "#16a34a" }} />
                            <Typography fontSize="0.72rem" color="text.disabled" sx={{ ml: "auto" }}>
                              {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </Typography>
                            <Chip
                              icon={<CheckCircle sx={{ fontSize: "0.7rem !important" }} />}
                              label="Verified"
                              size="small"
                              sx={{ height: 18, fontSize: "0.62rem", bgcolor: isDark ? "rgba(163,230,53,0.08)" : "rgba(22,163,74,0.08)", color: isDark ? "#a3e635" : "#16a34a", "& .MuiChip-icon": { color: "inherit" } }}
                            />
                          </Box>
                          <Typography fontWeight={700} fontSize="0.9rem" mb={0.75}>{c.title}</Typography>
                          <Typography
                            component="pre"
                            sx={{ fontFamily: "inherit", fontSize: "0.875rem", color: "text.secondary", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", m: 0 }}
                          >
                            {c.body.length > 300 ? c.body.slice(0, 300) + "…" : c.body}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              )}
            </motion.div>
          </Box>

        </motion.div>
      </Container>

      {/* Contribution dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700} sx={{ pb: 1 }}>Share a Tip or Guide</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 0.5, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Share anything useful — setup steps, fixes, tips, tools. Your name will be shown with the contribution.
              It will go live after a quick admin review.
            </Typography>
            <TextField
              select
              fullWidth
              label="Category"
              value={form.category}
              onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
              SelectProps={{ native: true }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </TextField>
            <TextField
              fullWidth
              required
              label="Title"
              placeholder="e.g. How to set up campus VPN on Ubuntu"
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              multiline
              rows={7}
              label="Content"
              placeholder="Write your tip, guide, or fix here. Include commands, steps, or links as needed."
              value={form.content}
              onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
            />
            {authUser && (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={authUser.picture} sx={{ width: 24, height: 24, fontSize: "0.65rem" }}>
                  {authUser.name?.[0]}
                </Avatar>
                <Typography fontSize="0.8rem" color="text.secondary">
                  Posting as <strong>{authUser.name}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
