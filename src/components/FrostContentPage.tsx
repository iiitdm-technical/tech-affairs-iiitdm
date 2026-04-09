"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box, Container, Typography, Button, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert, Avatar, Chip,
  Tooltip, CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { ArrowBack, Add, Person, CheckCircle, HourglassEmpty } from "@mui/icons-material";
import { usePathname } from "next/navigation";

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

interface Contribution {
  id: number;
  title: string;
  body: string;
  author_name: string;
  author_email: string;
  created_at: string;
  status: string;
}

interface AuthUser {
  name: string;
  email: string;
  picture: string;
}

function AuthorAvatar({ name, picture }: { name: string; picture?: string }) {
  return (
    <Avatar src={picture} sx={{ width: 24, height: 24, fontSize: '0.65rem' }}>
      {name?.[0]?.toUpperCase()}
    </Avatar>
  );
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
  const pathname = usePathname();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loadingContribs, setLoadingContribs] = useState(true);

  // Contribution dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  // Check auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { setAuthUser(data); setAuthChecked(true); })
      .catch(() => setAuthChecked(true));
  }, []);

  // Load approved contributions for this page
  useEffect(() => {
    if (!pathname) return;
    fetch(`/api/frost?page_path=${encodeURIComponent(pathname)}`)
      .then(r => r.ok ? r.json() : [])
      .then(setContributions)
      .catch(() => {})
      .finally(() => setLoadingContribs(false));
  }, [pathname]);

  async function handleSubmit() {
    if (!form.title.trim() || !form.content.trim()) {
      setSnack({ open: true, msg: 'Title and content are required', sev: 'error' });
      return;
    }
    setSubmitting(true);
    const res = await fetch('/api/frost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: pathname,
        page_title: title,
        title: form.title,
        content: form.content,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setDialogOpen(false);
      setForm({ title: '', content: '' });
      setSnack({ open: true, msg: 'Contribution submitted! It will appear after admin review.', sev: 'success' });
    } else {
      const d = await res.json().catch(() => ({}));
      setSnack({ open: true, msg: d.error || 'Submission failed', sev: 'error' });
    }
  }

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
              "& .frost-section": { mb: 5 },
              "& .frost-h2": {
                fontSize: { xs: "1.15rem", md: "1.3rem" }, fontWeight: 700,
                mb: 1.5, mt: 0, color: accentColor, letterSpacing: "-0.01em",
              },
              "& .frost-h3": {
                fontSize: "1rem", fontWeight: 650, mb: 1, mt: 0,
                color: isDark ? "rgba(163,230,53,0.7)" : "#16a34a",
              },
              "& .frost-p": {
                fontSize: "0.925rem", color: "text.secondary", lineHeight: 1.8, mb: 1.5,
              },
              "& .frost-code": {
                fontFamily: "monospace", fontSize: "0.85rem", px: 1, py: 0.25, borderRadius: 0.75,
                bgcolor: isDark ? "rgba(163,230,53,0.08)" : "rgba(22,163,74,0.06)",
                color: accentColor,
                border: `1px solid ${isDark ? "rgba(163,230,53,0.15)" : "rgba(22,163,74,0.2)"}`,
              },
              "& .frost-pre": {
                fontFamily: "monospace", fontSize: "0.85rem", p: 2.5, borderRadius: 2,
                overflowX: "auto",
                bgcolor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(163,230,53,0.12)" : "rgba(0,0,0,0.1)"}`,
                color: accentColor, mb: 2, whiteSpace: "pre",
              },
              "& .frost-link": {
                color: accentColor, textDecoration: "none",
                borderBottom: `1px solid ${accentColor}40`, transition: "border-color 0.15s",
                "&:hover": { borderBottomColor: accentColor },
              },
              "& .frost-ul": {
                pl: 2.5, mb: 1.5,
                "& li": {
                  fontSize: "0.925rem", color: "text.secondary", lineHeight: 1.8, mb: 0.5,
                  "&::marker": { color: accentColor },
                },
              },
              "& .frost-warning": {
                p: 2, borderRadius: 2,
                bgcolor: isDark ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.25)",
                color: "#f59e0b", fontSize: "0.875rem", lineHeight: 1.7, mb: 2,
              },
              "& .frost-note": {
                p: 2, borderRadius: 2,
                bgcolor: isDark ? "rgba(163,230,53,0.06)" : "rgba(22,163,74,0.04)",
                border: `1px solid ${isDark ? "rgba(163,230,53,0.15)" : "rgba(22,163,74,0.15)"}`,
                color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7, mb: 2,
              },
            }}
          >
            {children}
          </Box>

          {/* Community Contributions */}
          <Box mt={6}>
            <Divider sx={{ mb: 4, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1.5}>
              <Box>
                <Typography fontWeight={800} fontSize="1.1rem" letterSpacing="-0.02em">
                  Community Contributions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Additions and corrections submitted by IIITDM students. All are reviewed before appearing here.
                </Typography>
              </Box>

              {authChecked && (
                authUser ? (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    size="small"
                    onClick={() => setDialogOpen(true)}
                    sx={{
                      borderRadius: 2, borderColor: `${accentColor}60`,
                      color: accentColor, fontWeight: 600,
                      '&:hover': { borderColor: accentColor, bgcolor: `${accentColor}10` },
                    }}
                  >
                    Add Contribution
                  </Button>
                ) : (
                  <Tooltip title="Sign in with your IIITDM Google account to contribute">
                    <Button
                      component={Link}
                      href="/login"
                      variant="outlined"
                      startIcon={<Person />}
                      size="small"
                      sx={{
                        borderRadius: 2, borderColor: 'divider',
                        color: 'text.secondary', fontWeight: 600,
                        '&:hover': { borderColor: accentColor, color: accentColor },
                      }}
                    >
                      Login to contribute
                    </Button>
                  </Tooltip>
                )
              )}
            </Box>

            {loadingContribs ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={24} />
              </Box>
            ) : contributions.length === 0 ? (
              <Box
                sx={{
                  py: 4, textAlign: 'center',
                  border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 3,
                }}
              >
                <Typography color="text.disabled" fontSize="0.875rem">
                  No community contributions yet. Be the first!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {contributions.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{
                      p: 2.5, borderRadius: 3,
                      border: `1px solid ${isDark ? 'rgba(163,230,53,0.1)' : 'rgba(22,163,74,0.15)'}`,
                      bgcolor: isDark ? 'rgba(163,230,53,0.03)' : 'rgba(22,163,74,0.02)',
                    }}>
                      {/* Contribution header */}
                      <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
                        <AuthorAvatar name={c.author_name} />
                        <Typography fontSize="0.8rem" fontWeight={600}>{c.author_name}</Typography>
                        <Typography fontSize="0.75rem" color="text.disabled">·</Typography>
                        <Typography fontSize="0.75rem" color="text.disabled">
                          {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Typography>
                        <Chip
                          icon={<CheckCircle sx={{ fontSize: '0.75rem !important' }} />}
                          label="Verified"
                          size="small"
                          sx={{
                            height: 18, fontSize: '0.62rem', ml: 'auto',
                            bgcolor: isDark ? 'rgba(163,230,53,0.1)' : 'rgba(22,163,74,0.1)',
                            color: accentColor,
                            '& .MuiChip-icon': { color: accentColor },
                          }}
                        />
                      </Box>

                      {/* Title */}
                      <Typography fontWeight={700} fontSize="0.9rem" mb={1} color="text.primary">
                        {c.title}
                      </Typography>

                      {/* Body — render as plain text preserving whitespace */}
                      <Typography
                        component="pre"
                        sx={{
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          lineHeight: 1.75,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          m: 0,
                        }}
                      >
                        {c.body}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>

      {/* Contribution dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add Contribution</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Contributing to: <strong>{title}</strong>
              <br />
              Your contribution will be reviewed by an admin before it appears publicly.
            </Typography>
            <TextField
              fullWidth
              required
              label="Section title"
              placeholder="e.g. Proxy setup for hostel Wi-Fi"
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              multiline
              rows={6}
              label="Content"
              placeholder="Write your addition or correction here. You can include commands, steps, or tips."
              value={form.content}
              onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
