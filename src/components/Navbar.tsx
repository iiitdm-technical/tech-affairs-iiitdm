// app/components/Navbar/Navbar.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme as useMuiTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../context/ThemeContext";
import { usePathname } from "next/navigation";

// Define the User and Session types based on your application's data structure
export interface User {
  id: number;
  email: string;
  googleId: string;
  name: string;
  picture: string;
  role: string;       // Primary role: A > O > U
  roles?: string[];   // All roles for multi-role users
  orgSlugs: string[];
}

// Define the props for the Navbar component
interface NavbarProps {
  user: User | null;
}

import { navItems } from "@/data/navigation";

const Navbar = ({ user }: NavbarProps) => {
  const theme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const hasAdminRole = Boolean(user && (user.roles?.includes('A') || user.role === 'A'));
  const hasOrgAdminRole = Boolean(user && (user.roles?.includes('O') || user.role === 'O'));

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const logo = (
    <Box sx={{ position: "relative", height: 40, width: 40, flexShrink: 0 }}>
      <Box
        component="img"
        src="/nav_logo.webp"
        alt="Technical Affairs Logo"
        sx={{
          position: "absolute",
          inset: 0,
          height: "100%",
          width: "100%",
          objectFit: "contain",
          opacity: isDarkMode ? 1 : 0,
          transition: "opacity 0.12s linear",
        }}
      />
      <Box
        component="img"
        src="/nav_logo_inv.webp"
        alt="Technical Affairs Logo"
        sx={{
          position: "absolute",
          inset: 0,
          height: "100%",
          width: "100%",
          objectFit: "contain",
          opacity: isDarkMode ? 0 : 1,
          transition: "opacity 0.12s linear",
        }}
      />
    </Box>
  );

  const isActive = (path: string) => pathname === path;

  // Drawer for mobile view
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header with logo and close button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ mr: 0 }}>{logo}</Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Tech Affairs
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Navigation links */}
      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                color: isActive(item.path) ? "primary.main" : "text.primary",
                fontWeight: isActive(item.path) ? 700 : 500,
                bgcolor: isActive(item.path)
                  ? theme.palette.mode === "dark"
                    ? "rgba(163,230,53,0.1)"
                    : "rgba(163,230,53,0.08)"
                  : "transparent",
                borderLeft: isActive(item.path)
                  ? "3px solid"
                  : "3px solid transparent",
                borderColor: isActive(item.path) ? "primary.main" : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(163,230,53,0.08)"
                      : "rgba(163,230,53,0.05)",
                  color: "primary.main",
                },
              }}
            >
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: isActive(item.path) ? 700 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom section: theme toggle + auth */}
      <Box sx={{ px: 1, py: 1.5 }}>
        <ListItemButton
          onClick={toggleTheme}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            mb: 1,
            color: "text.primary",
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
            },
          }}
        >
          {isDarkMode ? (
            <Brightness7Icon sx={{ mr: 1.5, fontSize: 20 }} />
          ) : (
            <Brightness4Icon sx={{ mr: 1.5, fontSize: 20 }} />
          )}
          <ListItemText
            primary={isDarkMode ? "Light Mode" : "Dark Mode"}
            primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
          />
        </ListItemButton>

        {user ? (
          <>
            <ListItemButton
              component="a"
              href="/profile"
              onClick={handleDrawerToggle}
              sx={{ borderRadius: 2, py: 1.2, px: 2, mb: 0.5, color: 'text.primary',
                '&:hover': { bgcolor: 'rgba(163,230,53,0.08)' } }}>
              <ListItemText primary="Profile & Settings"
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
            </ListItemButton>
            <ListItemButton
              component="a"
              href="/logout"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                mb: 0.5,
                color: "text.primary",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
              />
            </ListItemButton>
            {hasAdminRole && (
              <ListItemButton
                component="a"
                href="/admin"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  color: "text.primary",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ListItemText
                  primary="Admin"
                  primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
                />
              </ListItemButton>
            )}
            {hasOrgAdminRole && (
              <ListItemButton
                component="a"
                href="/org-admin"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  color: "text.primary",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ListItemText
                  primary="Org Dashboard"
                  primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
                />
              </ListItemButton>
            )}
            {hasAdminRole && hasOrgAdminRole && (
              <ListItemButton
                component="a"
                href="/dashboard"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  color: "text.primary",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ListItemText
                  primary="Choose Dashboard"
                  primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
                />
              </ListItemButton>
            )}
          </>
        ) : (
          <Button
            component="a"
            href="/login"
            onClick={handleDrawerToggle}
            variant="contained"
            fullWidth
            sx={{
              mt: 0.5,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 650,
              fontSize: "0.9rem",
            }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        className={
          mounted && scrolled
            ? isDarkMode
              ? 'navbar-scrolled-dark'
              : 'navbar-scrolled-light'
            : 'navbar-transparent'
        }
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Box sx={{ mr: 2 }}>{logo}</Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: { xs: "none", md: "block" },
              fontWeight: 700,
              color: theme.palette.mode === "dark" ? "white" : "text.primary",
            }}
          >
            Technical Affairs
          </Typography>

          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                href={item.path}
                sx={{
                  color: theme.palette.mode === "dark" ? "white" : "text.primary",
                  "&:hover": { color: "primary.main" },
                  ...(pathname === item.path && {
                    color: "primary.main",
                    fontWeight: "bold",
                  }),
                }}
              >
                {item.name}
              </Button>
            ))}
              {hasAdminRole && (
                <Button
                  component="a"
                  href="/admin"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                  }}
                >
                  Admin
                </Button>
              )}

              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: theme.palette.mode === "dark" ? "white" : "text.primary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

            {/* User authentication section for desktop */}
            {user ? (
              <Box sx={{ flexGrow: 0, ml: 1 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src={user.picture} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem disabled sx={{ opacity: '1 !important' }}>
                    <Box>
                      <Typography fontWeight={700} fontSize="0.9rem">{user.name}</Typography>
                      <Typography fontSize="0.75rem" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem component="a" href="/profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile & Settings</Typography>
                  </MenuItem>
                  {hasAdminRole && (
                    <MenuItem component="a" href="/admin" onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Admin Dashboard</Typography>
                    </MenuItem>
                  )}
                  {hasOrgAdminRole && (
                    <MenuItem component="a" href="/org-admin" onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Org Dashboard</Typography>
                    </MenuItem>
                  )}
                  {hasAdminRole && hasOrgAdminRole && (
                    <MenuItem component="a" href="/dashboard" onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Choose Dashboard</Typography>
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem component="a" href="/logout" onClick={handleCloseUserMenu}
                    sx={{ color: 'error.main' }}>
                    <Typography textAlign="center">Sign out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component="a"
                href="/login"
                variant="contained"
                color="primary"
                sx={{ my: 1, ml: 1.5 }}
              >
                Sign In
              </Button>
            )}
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              color: theme.palette.mode === "dark" ? "white" : "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(3, 10, 6, 0.97)"
                : "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(20px) saturate(1.4)",
            borderLeft:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.07)"
                : "1px solid rgba(15,23,42,0.1)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
