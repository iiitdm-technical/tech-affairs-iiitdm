"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Avatar, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Divider, Chip, IconButton, useTheme, alpha, CircularProgress,
} from '@mui/material';
import {
  Event as EventIcon,
  EmojiEvents as TrophyIcon,
  Campaign as CampaignIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import EventsTab from './EventsTab';
import AchievementsTab from './AchievementsTab';
import AnnouncementsTab from './AnnouncementsTab';
import { useOrgs, slugToOrg } from '@/hooks/useOrgs';
import type { OrgItem } from '@/hooks/useOrgs';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

const NAV_ITEMS = [
  { label: 'Events',        icon: <EventIcon /> },
  { label: 'Achievements',  icon: <TrophyIcon /> },
  { label: 'Announcements', icon: <CampaignIcon /> },
];

interface AuthUser {
  id: number;
  name: string;
  email: string;
  picture: string;
  role: string;
  orgSlugs: string[];
}

export default function OrgAdminPage() {
  const router = useRouter();
  const theme = useTheme();
  const allOrgs = useOrgs();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) { router.push('/login'); return; }
      const data: AuthUser = await res.json();
      // Allow both Super Admins ('A') and Org Admins ('O') with org slugs
      if (data.role !== 'A' && data.role !== 'O') { router.push('/'); return; }
      if (data.orgSlugs.length === 0) { router.push('/'); return; }
      setUser(data);
      setLoading(false);
    })();
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
          <Typography color="text.secondary" fontSize="0.875rem">Loading…</Typography>
        </Box>
      </Box>
    );
  }

  if (!user) return null;

  const orgInfo: OrgItem | undefined = slugToOrg(user.orgSlugs[0], allOrgs);
  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.mode === 'dark' ? '#030a06' : '#f4f6fb' }}>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: theme.palette.mode === 'dark' ? '#05150a' : '#ffffff',
            borderRight: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(163,230,53,0.1)' : 'divider',
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
          },
        }}
      >
        {/* Logo / collapse toggle */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1 : 2.5, py: 2, minHeight: 64,
        }}>
          {!collapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {orgInfo?.image ? (
                <Box component="img" src={orgInfo.image} alt={orgInfo.name}
                  sx={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 1 }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography fontSize="0.75rem" fontWeight={800} color="#fff">
                    {user.orgSlugs[0]?.[0]?.toUpperCase()}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography fontWeight={800} fontSize="0.9rem" lineHeight={1.1} noWrap>
                  {orgInfo?.name ?? user.orgSlugs[0]}
                </Typography>
                <Typography fontSize="0.7rem" color="text.secondary" lineHeight={1.1}>Org Dashboard</Typography>
              </Box>
            </Box>
          )}
          <IconButton size="small" onClick={() => setCollapsed(c => !c)} sx={{ ml: collapsed ? 0 : 'auto' }}>
            {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>

        <Divider />

        {/* Nav items */}
        <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
          {NAV_ITEMS.map((item, i) => {
            const active = tab === i;
            return (
              <ListItemButton
                key={item.label}
                onClick={() => setTab(i)}
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
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}
                  />
                )}
                {!collapsed && active && (
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main', ml: 1 }} />
                )}
              </ListItemButton>
            );
          })}
        </List>

        <Divider />

        {/* Bottom: user + actions */}
        <Box sx={{ p: collapsed ? 1 : 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {!collapsed && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              p: 1.5, borderRadius: 2,
              bgcolor: alpha(theme.palette.text.primary, 0.04),
            }}>
              <Avatar src={user.picture} sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                {user.name?.[0]}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography fontSize="0.8rem" fontWeight={600} noWrap>{user.name}</Typography>
                <Chip label="Org Admin" size="small" color="primary" sx={{ height: 16, fontSize: '0.65rem', mt: 0.25 }} />
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
              <ListItemButton
                onClick={() => router.push('/')}
                sx={{ borderRadius: 2, px: 2, py: 1, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><HomeIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Back to Site" primaryTypographyProps={{ fontSize: '0.85rem' }} />
              </ListItemButton>
              <ListItemButton
                onClick={() => router.push('/logout')}
                sx={{ borderRadius: 2, px: 2, py: 1, color: 'error.main', '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.85rem' }} />
              </ListItemButton>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <Box sx={{
          px: 4, py: 2.5,
          bgcolor: theme.palette.mode === 'dark' ? '#05150a' : '#ffffff',
          borderBottom: '1px solid', borderColor: 'divider',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {NAV_ITEMS[tab].label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {orgInfo?.name ?? user.orgSlugs[0]} · Org Admin Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={user.picture} sx={{ width: 34, height: 34, fontSize: '0.8rem' }}>
              {user.name?.[0]}
            </Avatar>
          </Box>
        </Box>

        {/* Page content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflowY: 'auto' }}>
          {tab === 0 && <EventsTab orgSlugs={user.orgSlugs} />}
          {tab === 1 && <AchievementsTab orgSlugs={user.orgSlugs} />}
          {tab === 2 && <AnnouncementsTab orgSlugs={user.orgSlugs} />}
        </Box>
      </Box>
    </Box>
  );
}
