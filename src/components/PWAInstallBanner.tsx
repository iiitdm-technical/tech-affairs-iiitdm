"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Don't show if already installed or dismissed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      sessionStorage.getItem('pwa-banner-dismissed')
    ) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    sessionStorage.setItem('pwa-banner-dismissed', '1');
    setShow(false);
  }

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 16, md: 24 },
        left: { xs: 16, md: 24 },
        zIndex: 1400,
        maxWidth: 360,
        borderRadius: 3,
        background: isDark
          ? 'linear-gradient(135deg, rgba(7,11,24,0.96), rgba(13,24,45,0.96))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(240,253,244,0.97))',
        border: `1px solid ${isDark ? 'rgba(125,211,252,0.2)' : 'rgba(51,73,132,0.2)'}`,
        backdropFilter: 'blur(20px)',
        boxShadow: isDark
          ? '0 8px 32px -4px rgba(0,0,0,0.6), 0 0 0 1px rgba(125,211,252,0.1)'
          : '0 8px 32px -4px rgba(15,23,42,0.15)',
        p: 2.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        animation: 'slideUp 0.3s ease',
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/nav_logo.webp"
        alt="Tech Affairs"
        sx={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0, mt: 0.5 }}
      />

      <Box flex={1} minWidth={0}>
        <Typography fontWeight={700} fontSize="0.9rem" color="text.primary" mb={0.3}>
          Install Tech Affairs
        </Typography>
        <Typography fontSize="0.78rem" color="text.secondary" mb={1.5} lineHeight={1.5}>
          Add to your home screen for quick access to announcements, events & achievements.
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<GetAppIcon sx={{ fontSize: '1rem' }} />}
          onClick={handleInstall}
          sx={{
            borderRadius: 2,
            fontSize: '0.78rem',
            fontWeight: 650,
            px: 2,
            py: 0.7,
            background: isDark
              ? 'linear-gradient(135deg, #1f82b1, #7dd3fc)'
              : 'linear-gradient(135deg, #334984, #1f82b1)',
            color: isDark ? '#070b18' : '#eff6ff',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #1f82b1, #38bdf8)'
                : 'linear-gradient(135deg, #283b70, #334984)',
            },
          }}
        >
          Install App
        </Button>
      </Box>

      <IconButton
        size="small"
        onClick={handleDismiss}
        sx={{ color: 'text.secondary', mt: -0.5, mr: -0.5, flexShrink: 0 }}
      >
        <CloseIcon sx={{ fontSize: '1rem' }} />
      </IconButton>
    </Box>
  );
}
