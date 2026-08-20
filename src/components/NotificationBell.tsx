"use client";

import { Box, IconButton, Badge, Tooltip, useTheme } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { usePathname } from 'next/navigation';
import { announcements } from '@/lib/data/content';

export default function NotificationBell() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const pathname = usePathname();
  const count = announcements.length;
  const pulse = count > 0;

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
              ? 'linear-gradient(135deg, rgba(125,211,252,0.15), rgba(147,197,253,0.08))'
              : 'linear-gradient(135deg, rgba(51,73,132,0.12), rgba(31,130,177,0.08))',
            border: `1px solid ${isDark ? 'rgba(125,211,252,0.3)' : 'rgba(51,73,132,0.25)'}`,
            backdropFilter: 'blur(16px)',
            boxShadow: isDark
              ? '0 4px 20px -4px rgba(125,211,252,0.35), 0 2px 8px rgba(0,0,0,0.4)'
              : '0 4px 20px -4px rgba(51,73,132,0.3), 0 2px 8px rgba(0,0,0,0.1)',
            color: isDark ? '#7dd3fc' : '#334984',
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
                ? '0 8px 28px -4px rgba(125,211,252,0.5)'
                : '0 8px 28px -4px rgba(51,73,132,0.4)',
              background: isDark
                ? 'linear-gradient(135deg, rgba(125,211,252,0.22), rgba(147,197,253,0.14))'
                : 'linear-gradient(135deg, rgba(51,73,132,0.18), rgba(31,130,177,0.12))',
            },
          }}
        >
          <Badge
            badgeContent={count > 0 ? count : undefined}
            max={9}
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#f59e0b',
                color: '#070b18',
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
