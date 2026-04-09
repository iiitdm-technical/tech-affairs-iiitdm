"use client";

import { useState, useEffect } from 'react';
import { Box, IconButton, Badge, Tooltip, useTheme } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { usePathname } from 'next/navigation';

export default function NotificationBell() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.ok ? r.json() : [])
      .then((rows: unknown[]) => {
        setCount(rows.length);
        if (rows.length > 0) setPulse(true);
      })
      .catch(() => {});
  }, []);

  // Hide on announcements page itself
  if (pathname === '/announcements') return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 28 },
        right: { xs: 16, md: 24 },
        zIndex: 1300,
      }}
    >
      <Tooltip title="Announcements" placement="left">
        <IconButton
          component="a"
          href="/announcements"
          aria-label="View announcements"
          sx={{
            width: 52, height: 52,
            background: isDark
              ? 'linear-gradient(135deg, rgba(163,230,53,0.15), rgba(74,222,128,0.08))'
              : 'linear-gradient(135deg, rgba(21,128,61,0.12), rgba(74,222,128,0.08))',
            border: `1px solid ${isDark ? 'rgba(163,230,53,0.3)' : 'rgba(21,128,61,0.25)'}`,
            backdropFilter: 'blur(16px)',
            boxShadow: isDark
              ? '0 4px 20px -4px rgba(163,230,53,0.35), 0 2px 8px rgba(0,0,0,0.4)'
              : '0 4px 20px -4px rgba(21,128,61,0.3), 0 2px 8px rgba(0,0,0,0.1)',
            color: isDark ? '#a3e635' : '#15803d',
            transition: 'all 0.25s ease',
            ...(pulse && {
              animation: 'bellPulse 2.5s ease-in-out 3',
              '@keyframes bellPulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.08)' },
              },
            }),
            '&:hover': {
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: isDark
                ? '0 8px 28px -4px rgba(163,230,53,0.5)'
                : '0 8px 28px -4px rgba(21,128,61,0.4)',
              background: isDark
                ? 'linear-gradient(135deg, rgba(163,230,53,0.22), rgba(74,222,128,0.14))'
                : 'linear-gradient(135deg, rgba(21,128,61,0.18), rgba(74,222,128,0.12))',
            },
          }}
        >
          <Badge
            badgeContent={count > 0 ? count : undefined}
            max={9}
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#f59e0b',
                color: '#030a06',
                fontWeight: 700,
                fontSize: '0.65rem',
                minWidth: 18,
                height: 18,
                padding: '0 4px',
              },
            }}
          >
            <NotificationsIcon sx={{ fontSize: '1.4rem' }} />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  );
}
