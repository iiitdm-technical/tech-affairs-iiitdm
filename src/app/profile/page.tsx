"use client";

import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Avatar, Button, Chip, Divider, IconButton,
  Card, CardContent, Skeleton, Tooltip, Switch, FormControlLabel, Alert,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Logout, AccessTime, DevicesOther, DeleteSweep,
  AdminPanelSettings, Groups, Brightness4, Brightness7, ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useThemeContext } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  picture: string;
  role: string;
  orgSlugs: string[];
}

interface SessionInfo {
  id: string;
  expiresAt: string;
  current: boolean;
}

const ROLE_LABELS: Record<string, { label: string; color: 'error' | 'warning' | 'info' }> = {
  A: { label: 'Super Admin', color: 'error'   },
  O: { label: 'Org Admin',   color: 'warning' },
  U: { label: 'Student',     color: 'info'    },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function timeUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return 'Expired';
  if (days === 1) return 'Expires tomorrow';
  return `Expires in ${days} days`;
}

export default function ProfilePage() {
  const router = useRouter();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const isDark = theme.palette.mode === 'dark';
  const [user, setUser] = useState<UserInfo | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' | 'info' }>({
    open: false, msg: '', sev: 'success',
  });
  const toast = (msg: string, sev: 'success' | 'error' | 'info' = 'success') =>
    setSnack({ open: true, msg, sev });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) { router.push('/login'); return; }
        setUser(u);
        setLoadingUser(false);
      });

    fetch('/api/auth/sessions')
      .then((r) => (r.ok ? r.json() : []))
      .then((s) => { setSessions(s); setLoadingSessions(false); });
  }, [router]);

  async function revokeSession(sessionId: string) {
    const res = await fetch('/api/auth/sessions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (res.ok) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast('Session revoked');
    } else {
      toast('Failed to revoke', 'error');
    }
  }

  async function revokeAllOther() {
    const res = await fetch('/api/auth/sessions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revokeAll: true }),
    });
    if (res.ok) {
      const { revoked } = await res.json();
      setSessions((prev) => prev.filter((s) => s.current));
      toast(`Revoked ${revoked} other session${revoked !== 1 ? 's' : ''}`, 'info');
    } else {
      toast('Failed', 'error');
    }
  }

  const roleInfo = user ? (ROLE_LABELS[user.role] ?? ROLE_LABELS.U) : null;
  const otherSessions = sessions.filter((s) => !s.current);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 10, md: 12 } }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* Back */}
        <Box mb={3}>
          <Button component={Link} href="/" startIcon={<ArrowBack />} size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            Back to site
          </Button>
        </Box>

        {/* Profile card */}
        <Card sx={{
          mb: 3, overflow: 'visible',
          bgcolor: isDark ? 'rgba(5,46,22,0.45)' : 'background.paper',
          border: `1px solid ${isDark ? 'rgba(163,230,53,0.12)' : 'rgba(0,0,0,0.08)'}`,
        }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            {loadingUser ? (
              <Box display="flex" gap={2} alignItems="center">
                <Skeleton variant="circular" width={72} height={72} />
                <Box flex={1}>
                  <Skeleton variant="text" width="60%" height={28} />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width={80} height={20} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            ) : user && roleInfo && (
              <Box display="flex" gap={2} alignItems="flex-start">
                <Avatar src={user.picture} sx={{
                  width: 72, height: 72, border: `3px solid`,
                  borderColor: 'primary.main',
                  boxShadow: isDark ? '0 0 20px rgba(163,230,53,0.3)' : '0 4px 16px rgba(0,0,0,0.12)',
                }}>
                  {user.name[0]}
                </Avatar>
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={800} fontSize="1.2rem" lineHeight={1.2} noWrap>
                    {user.name}
                  </Typography>
                  <Typography color="text.secondary" fontSize="0.875rem" mt={0.25} noWrap>
                    {user.email}
                  </Typography>
                  <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                    <Chip
                      label={roleInfo.label}
                      color={roleInfo.color}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                    {user.orgSlugs.length > 0 && user.orgSlugs.map((slug) => (
                      <Chip key={slug} label={slug} size="small" variant="outlined"
                        sx={{ fontSize: '0.68rem' }} />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card sx={{
          mb: 3,
          bgcolor: isDark ? 'rgba(5,46,22,0.45)' : 'background.paper',
          border: `1px solid ${isDark ? 'rgba(163,230,53,0.12)' : 'rgba(0,0,0,0.08)'}`,
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary"
              letterSpacing="0.08em" textTransform="uppercase" fontSize="0.7rem" mb={2}>
              Preferences
            </Typography>

            {/* Theme toggle */}
            <Box display="flex" alignItems="center" justifyContent="space-between" py={1}>
              <Box display="flex" alignItems="center" gap={1.5}>
                {isDarkMode ? <Brightness7 sx={{ color: 'text.secondary', fontSize: 20 }} />
                  : <Brightness4 sx={{ color: 'text.secondary', fontSize: 20 }} />}
                <Box>
                  <Typography fontSize="0.9rem" fontWeight={500}>
                    {isDarkMode ? 'Dark mode' : 'Light mode'}
                  </Typography>
                  <Typography fontSize="0.75rem" color="text.secondary">
                    Toggle site appearance
                  </Typography>
                </Box>
              </Box>
              <Switch checked={isDarkMode} onChange={toggleTheme} color="primary" />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Admin / Org links */}
            {user?.role === 'A' && (
              <Box py={1}>
                <Button fullWidth variant="outlined" startIcon={<AdminPanelSettings />}
                  href="/admin" component={Link}
                  sx={{ justifyContent: 'flex-start', fontWeight: 600, borderRadius: 2 }}>
                  Admin Dashboard
                </Button>
              </Box>
            )}
            {user?.role === 'O' && (
              <Box py={1}>
                <Button fullWidth variant="outlined" startIcon={<Groups />}
                  href="/org-admin" component={Link}
                  sx={{ justifyContent: 'flex-start', fontWeight: 600, borderRadius: 2 }}>
                  Org Dashboard
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Logout */}
            <Box py={1}>
              <Button fullWidth variant="outlined" color="error" startIcon={<Logout />}
                href="/logout" component="a"
                sx={{ justifyContent: 'flex-start', fontWeight: 600, borderRadius: 2 }}>
                Sign out
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Active sessions */}
        <Card sx={{
          bgcolor: isDark ? 'rgba(5,46,22,0.45)' : 'background.paper',
          border: `1px solid ${isDark ? 'rgba(163,230,53,0.12)' : 'rgba(0,0,0,0.08)'}`,
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary"
                letterSpacing="0.08em" textTransform="uppercase" fontSize="0.7rem">
                Active Sessions
              </Typography>
              {otherSessions.length > 0 && (
                <Tooltip title="Revoke all other sessions">
                  <Button size="small" color="error" startIcon={<DeleteSweep />}
                    onClick={revokeAllOther} sx={{ fontSize: '0.75rem' }}>
                    Revoke others
                  </Button>
                </Tooltip>
              )}
            </Box>

            {loadingSessions ? (
              [1, 2].map((i) => (
                <Box key={i} py={1.5} display="flex" gap={1.5} alignItems="center">
                  <Skeleton variant="circular" width={36} height={36} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="50%" height={18} />
                    <Skeleton variant="text" width="30%" height={14} />
                  </Box>
                </Box>
              ))
            ) : sessions.length === 0 ? (
              <Typography color="text.secondary" fontSize="0.85rem">No active sessions.</Typography>
            ) : (
              sessions.map((s, i) => (
                <Box key={s.id}>
                  {i > 0 && <Divider sx={{ my: 1 }} />}
                  <Box display="flex" alignItems="center" gap={1.5} py={0.75}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: s.current
                        ? isDark ? 'rgba(163,230,53,0.15)' : 'rgba(22,163,74,0.1)'
                        : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    }}>
                      <DevicesOther fontSize="small"
                        sx={{ color: s.current ? 'primary.main' : 'text.disabled' }} />
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontSize="0.85rem" fontWeight={600} noWrap>
                          {s.current ? 'This device' : 'Other device'}
                        </Typography>
                        {s.current && (
                          <Chip label="current" size="small" color="primary"
                            sx={{ height: 18, fontSize: '0.62rem' }} />
                        )}
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.25}>
                        <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography fontSize="0.72rem" color="text.secondary">
                          {timeUntil(s.expiresAt)}
                        </Typography>
                      </Box>
                    </Box>
                    {!s.current && (
                      <Tooltip title="Revoke this session">
                        <IconButton size="small" color="error"
                          onClick={() => revokeSession(s.id)}
                          sx={{ flexShrink: 0 }}>
                          <Logout fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </CardContent>
        </Card>

      </motion.div>

      <Snackbar open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
