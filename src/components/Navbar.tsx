// app/components/Navbar/Navbar.tsx

"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../context/ThemeContext";
import { usePathname } from "next/navigation";

import navItems from "../../data/site/navigation.json";

const Navbar = () => {
  const theme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

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
                    ? "rgba(125,211,252,0.1)"
                    : "rgba(51,73,132,0.08)"
                  : "transparent",
                borderLeft: isActive(item.path)
                  ? "3px solid"
                  : "3px solid transparent",
                borderColor: isActive(item.path) ? "primary.main" : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(125,211,252,0.08)"
                      : "rgba(51,73,132,0.05)",
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

      {/* Bottom section: theme toggle */}
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
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.mode === "dark" ? "white" : "text.primary",
                "&:hover": { color: "primary.main" },
              }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
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
                ? "rgba(7, 11, 24, 0.97)"
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
