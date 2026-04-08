"use client";

import { useState, useEffect } from 'react';
import {
  Typography, Box, Avatar, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Divider, Chip, IconButton, useTheme, alpha, useMediaQuery,
  BottomNavigation, BottomNavigationAction, Paper,
} from '@mui/material';
import {
  Event as EventIcon,
  AdminPanelSettings as AdminIcon,
  EmojiEvents as TrophyIcon,
  AccountTree as OrgIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import EventsManagement from './EventsManagement';
import ClubsOrgsManagement from './ClubsOrgsManagement';
import OrgAdminsManagement from './OrgAdminsManagement';
import AchievementsManagement from './AchievementsManagement';
import TeamFullManagement from './TeamFullManagement';
import { User } from '@/lib/server/user';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

const NAV_ITEMS = [
  { label: 'Events',       icon: <EventIcon />,  },
  { label: 'Clubs & Orgs', icon: <OrgIcon />,    },
  { label: 'Org Admins',   icon: <AdminIcon />,  },
  { label: 'Achievements', icon: <TrophyIcon />, },
  { label: 'Team',         icon: <PeopleIcon />, },
];

export default function AdminPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(async (res) => {
      if (res.ok) {
        const u = await res.json();
        if (u.role !== 'A') { router.push('/'); return; }
        setUser(u);
      } else {
        router.push('/login');
      }
      setLoading(false);
    }).catch(() => { router.push('/'); setLoading(false); });
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '50%', border: '3px solid',
            borderColor: 'primary.main', borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite', mx: 'auto', mb: 2,
            '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          }} />
          <Typography color="text.secondary" fontSize="0.875rem">Loading dashboard…</Typography>
        </Box>
      </Box>
    );
  }

  if (!user) return null;

  const isDark = theme.palette.mode === 'dark';
  const sidebarBg = isDark ? '#05150a' : '#ffffff';
  const sidebarBorder = isDark ? 'rgba(163,230,53,0.1)' : theme.palette.divider;
  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  // Desktop sidebar content
  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        px: collapsed ? 1 : 2.5, py: 2, minHeight: 64,
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="img" src="/ta-logo-dark.webp" alt="TA"
              sx={{ width: 32, height: 32, objectFit: 'contain' }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }} />
            <Box>
              <Typography fontWeight={800} fontSize="0.9rem" lineHeight={1.1}>Admin</Typography>
              <Typography fontSize="0.7rem" color="text.secondary" lineHeight={1.1}>Technical Affairs</Typography>
            </Box>
          </Box>
        )}
        <IconButton size="small" onClick={() => setCollapsed(c => !c)} sx={{ ml: collapsed ? 0 : 'auto' }}>
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.map((item, i) => {
          const active = tab === i;
          return (
            <ListItemButton key={item.label} onClick={() => setTab(i)}
              sx={{
                borderRadius: 2, mb: 0.5,
                px: collapsed ? 1.5 : 2,
                justifyContent: collapsed ? 'center' : 'flex-start',
                minHeight: 44,
                bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                color: active ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.18) : alpha(theme.palette.text.primary, 0.06),
                },
                transition: 'all 0.15s',
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'inherit', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }} />
              )}
              {!collapsed && active && (
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main', ml: 1 }} />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: collapsed ? 1 : 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.text.primary, 0.04) }}>
            <Avatar src={(user as unknown as { picture?: string }).picture} sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>
              {user.name?.[0]}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography fontSize="0.8rem" fontWeight={600} noWrap>{user.name}</Typography>
              <Chip label="Super Admin" size="small" color="primary" sx={{ height: 16, fontSize: '0.65rem', mt: 0.25 }} />
            </Box>
          </Box>
        )}
        {collapsed ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
            <IconButton size="small" title="Back to site" onClick={() => router.push('/')} sx={{ color: 'text.secondary' }}>
              <HomeIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" title="Logout" onClick={() => router.push('/logout')} sx={{ color: 'text.secondary' }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <ListItemButton onClick={() => router.push('/')}
              sx={{ borderRadius: 2, px: 2, py: 1, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><HomeIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Back to Site" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItemButton>
            <ListItemButton onClick={() => router.push('/logout')}
              sx={{ borderRadius: 2, px: 2, py: 1, color: 'error.main', '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) } }}>
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItemButton>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: isDark ? '#030a06' : '#f4f6fb' }}>

      {/* Desktop: permanent sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth, flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth, boxSizing: 'border-box',
              bgcolor: sidebarBg, borderRight: '1px solid', borderColor: sidebarBorder,
              transition: 'width 0.2s ease', overflowX: 'hidden',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <Box sx={{
          px: { xs: 2, md: 4 }, py: { xs: 1.5, md: 2.5 },
          bgcolor: sidebarBg,
          borderBottom: '1px solid', borderColor: sidebarBorder,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
          gap: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}
                fontSize={{ xs: '1rem', md: '1.25rem' }}>
                {NAV_ITEMS[tab].label}
              </Typography>
              <Typography variant="caption" color="text.secondary"
                sx={{ display: { xs: 'none', sm: 'block' } }}>
                Technical Affairs Admin Dashboard
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => router.push('/profile')}
            title="Profile & Settings"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <Avatar
              src={(user as unknown as { picture?: string }).picture}
              sx={{ width: 34, height: 34, fontSize: '0.8rem' }}
            >
              {user.name?.[0]}
            </Avatar>
          </IconButton>
        </Box>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <Box sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 4 },
          overflowY: 'auto',
          pb: { xs: 10, md: 4 },
        }}>
          {tab === 0 && <EventsManagement />}
          {tab === 1 && <ClubsOrgsManagement />}
          {tab === 2 && <OrgAdminsManagement />}
          {tab === 3 && <AchievementsManagement />}
          {tab === 4 && <TeamFullManagement />}
        </Box>
      </Box>

      {/* Mobile bottom navigation */}
      {isMobile && (
        <Paper
          sx={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
            borderTop: '1px solid', borderColor: sidebarBorder,
            bgcolor: sidebarBg,
          }}
          elevation={0}
        >
          <BottomNavigation
            value={tab}
            onChange={(_, v) => {
              if (v === NAV_ITEMS.length) { router.push('/profile'); return; }
              setTab(v);
            }}
            sx={{
              bgcolor: 'transparent', height: 60,
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                minWidth: 0, flex: 1, px: 0.5,
                '&.Mui-selected': { color: 'primary.main' },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.6rem',
                '&.Mui-selected': { fontSize: '0.65rem' },
              },
            }}
          >
            {NAV_ITEMS.map((item) => (
              <BottomNavigationAction
                key={item.label}
                label={item.label}
                icon={item.icon}
              />
            ))}
            <BottomNavigationAction label="Profile" icon={<ProfileIcon />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
