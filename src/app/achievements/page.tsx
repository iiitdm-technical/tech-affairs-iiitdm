"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, GridLegacy as Grid, Card, CardContent, Divider, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

interface Achievement {
  id: number;
  org_slug: string;
  title: string;
  description: string;
  year: string;
  logo: string;
  org_name?: string;
}

interface OrgRow {
  id: number;
  name: string;
  image: string;
  link: string;
  category: string;
}

const GradientTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: { fontSize: '2rem', marginBottom: theme.spacing(3) },
}));

const YearHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(6),
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: { fontSize: '1.5rem', marginBottom: theme.spacing(3), marginTop: theme.spacing(4) },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows?.[3] || '0 4px 6px rgba(0,0,0,0.1)',
  width: '100%',
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
}));

function slugToOrg(slug: string, orgs: OrgRow[]): OrgRow | undefined {
  // Match by last path segment of link against org_slug
  return orgs.find((o) => o.link.endsWith('/' + slug.split('/').pop()));
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    Promise.all([
      fetch('/api/achievements').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/orgs').then((r) => (r.ok ? r.json() : [])),
    ]).then(([achRows, orgRows]) => {
      const enriched: Achievement[] = achRows.map((a: Achievement) => {
        const org = slugToOrg(a.org_slug, orgRows);
        return {
          ...a,
          org_name: org?.name ?? a.org_slug,
          logo: a.logo || org?.image || '',
        };
      });
      setAchievements(enriched);
      setOrgs(orgRows);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = achievements
    .filter((a) => selectedOrg === 'all' || a.org_name === selectedOrg)
    .filter((a) => selectedYear === 'all' || a.year === selectedYear)
    .sort((a, b) => {
      if (b.year !== a.year) return parseInt(b.year) - parseInt(a.year);
      return b.id - a.id;
    });

  const grouped = filtered.reduce((acc: Record<string, Achievement[]>, a) => {
    if (!acc[a.year]) acc[a.year] = [];
    acc[a.year].push(a);
    return acc;
  }, {});

  const orgNames = ['all', ...Array.from(new Set(achievements.map((a) => a.org_name ?? a.org_slug))).sort()];
  const years = ['all', ...Array.from(new Set(achievements.map((a) => a.year))).sort((a, b) => parseInt(b) - parseInt(a))];

  return (
    <Box sx={{ padding: { xs: '100px 16px 32px', sm: '80px 24px 32px' }, textAlign: 'center' }}>
      <GradientTitle variant="h2">Achievements</GradientTitle>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
      ) : (
        <>
          <Box sx={{
            display: 'flex', justifyContent: 'center', gap: 2, mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <Select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} displayEmpty>
                {orgNames.map((c) => (
                  <MenuItem key={c} value={c}>{c === 'all' ? 'All Clubs/Teams' : c}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} displayEmpty>
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y === 'all' ? 'All Years' : y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
            {Object.entries(grouped)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([year, items]) => (
                <Box key={year} sx={{ mb: 5 }}>
                  <YearHeading variant="h4">{year}</YearHeading>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {items.map((a) => (
                      <Grid item xs={12} md={6} key={a.id} sx={{ display: 'flex', width: '100%' }}>
                        <StyledCard>
                          {a.logo && (
                            <Box sx={{
                              width: { xs: '100%', sm: 100 }, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              p: 1, mb: { xs: 1, sm: 0 },
                            }}>
                              <Box component="img"
                                sx={{ height: 'auto', maxHeight: { xs: 120, sm: 100 }, width: { xs: '80%', sm: '100%' }, objectFit: 'contain' }}
                                alt={`${a.org_name} logo`}
                                src={a.logo}
                              />
                            </Box>
                          )}
                          <CardContent sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' }, pt: { xs: 0, sm: 2 } }}>
                            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                              {a.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              {a.description}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              {a.org_name}
                            </Typography>
                          </CardContent>
                        </StyledCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            {Object.keys(grouped).length === 0 && (
              <Typography color="text.secondary" py={6}>No achievements found.</Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
