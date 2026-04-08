"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useOrgsByCategory, useOrgs } from "@/hooks/useOrgs";
import { Skeleton } from "@mui/material";

const TeamCard = styled(Card)(({ theme }) => ({
  width: 140,
  height: 180,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRadius: 18,
  background: theme.palette.mode === "dark" ? "rgba(3,15,8,0.75)" : "rgba(255,255,255,0.85)",
  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(163,230,53,0.1)" : "rgba(163,230,53,0.14)"}`,
  boxShadow: "none",
  transition: "transform 0.35s cubic-bezier(.22,.61,.36,1), box-shadow 0.35s ease, border-color 0.35s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-6px) scale(1.02)",
    boxShadow: theme.palette.mode === "dark"
      ? "0 24px 48px -12px rgba(0,0,0,0.4)"
      : "0 24px 48px -12px rgba(15,23,42,0.18)",
    borderColor: "#fb923c",
  },
  [theme.breakpoints.down("sm")]: {
    width: 130,
    height: 160,
  },
}));

const TAB_META = [
  { label: "Clubs",       category: "club",      route: "clubs",       color: "#a3e635" },
  { label: "Teams",       category: "team",      route: "teams",       color: "#4ade80" },
  { label: "Societies",   category: "society",   route: "societies",   color: "#f59e0b" },
  { label: "Communities", category: "community", route: "communities", color: "#fcd34d" },
];

export default function Council() {
  const pathname = usePathname();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  const allOrgs     = useOrgs();
  const orgsLoaded  = allOrgs.length > 0;
  const clubs       = useOrgsByCategory('club');
  const teams       = useOrgsByCategory('team');
  const societies   = useOrgsByCategory('society');
  const communities = useOrgsByCategory('community');
  const orgsByTab   = [clubs, teams, societies, communities];

  const getTabFromPath = useCallback(() => {
    const parts = pathname.split("/");
    if (parts.length >= 3) {
      const idx = TAB_META.findIndex(
        (opt) => opt.route === parts[2].toLowerCase()
      );
      return idx !== -1 ? idx : 0;
    }
    return 0;
  }, [pathname]);

  const [tab, setTab] = useState(getTabFromPath());

  useEffect(() => {
    setTab(getTabFromPath());
  }, [getTabFromPath]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const currentList = orgsByTab[tab];
  const currentColor = TAB_META[tab].color;

  const tabsVariant: "fullWidth" | "scrollable" | "standard" = isXs ? "scrollable" : "fullWidth";
  const scrollButtons = isXs;

  return (
    <Box
      sx={{
        mt: { xs: 7, md: 9 },
        py: { xs: 1, md: 2 },
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{
            fontSize: '0.72rem',
            fontWeight: 650,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#fb923c',
            mb: 1.5,
            textAlign: 'center',
          }}
        >
          Our Bodies
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", sm: "2.8rem", md: "3.5rem" },
            fontWeight: 800,
            mb: 3,
            textAlign: "center",
            letterSpacing: '-0.035em',
            lineHeight: 1.12,
            color: 'text.primary',
          }}
        >
          Technical{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #fb923c, #f472b6, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Council
          </Box>
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant={tabsVariant}
          scrollButtons={scrollButtons}
          allowScrollButtonsMobile
          sx={{
            mb: 3,
            borderRadius: 3,
            bgcolor: isDark ? 'rgba(3,15,8,0.75)' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${isDark ? 'rgba(163,230,53,0.14)' : 'rgba(163,230,53,0.17)'}`,
            boxShadow: 'none',
            minHeight: 36,
            mx: "auto",
            width: "100%",
            "& .MuiTabs-indicator": {
              background: `linear-gradient(90deg, ${currentColor}, #4ade80)`,
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          {TAB_META.map((option) => (
            <Tab
              key={option.label}
              label={option.label}
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                color: "text.secondary",
                minHeight: 36,
                px: { xs: 0.5, sm: 2 },
                letterSpacing: '-0.01em',
                transition: "color 0.2s",
                "&.Mui-selected": {
                  color: option.color,
                },
              }}
            />
          ))}
        </Tabs>

        {/* Cards */}
        <Grid
          container
          spacing={1}
          justifyContent="center"
          sx={{
            maxWidth: "1000px",
            mx: "auto",
          }}
        >
          {!orgsLoaded && [...Array(6)].map((_, i) => (
            <Grid item key={i} xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton variant="rounded" width={140} height={180} sx={{ borderRadius: '18px' }} />
            </Grid>
          ))}
          {orgsLoaded && currentList.length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={6}>
                <Typography color="text.secondary">No organisations in this category yet.</Typography>
              </Box>
            </Grid>
          )}
          {orgsLoaded && currentList.map((item) => (
            <Grid
              item
              key={item.name}
              xs={6}
              sm={4}
              md={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              <Link href={item.link} passHref>
                <TeamCard
                  tabIndex={0}
                  role="button"
                  aria-label={item.name}
                >
                  <Box
                    sx={{
                      width: { xs: 70, sm: 85 },
                      height: { xs: 70, sm: 85 },
                      mb: 1,
                      bgcolor: isDark ? 'rgba(163,230,53,0.06)' : 'rgba(21,128,61,0.05)',
                      borderRadius: 3.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${isDark ? 'rgba(163,230,53,0.1)' : 'rgba(163,230,53,0.13)'}`,
                      overflow: "hidden",
                      p: 1,
                      position: "relative",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      mb: 0,
                      letterSpacing: '-0.01em',
                      wordBreak: "break-word",
                      maxWidth: "100%",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.name}
                  </Typography>
                </TeamCard>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
