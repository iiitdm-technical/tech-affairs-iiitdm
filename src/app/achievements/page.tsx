"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, Button,
  GridLegacy as Grid, Card, CardContent, Divider, CircularProgress,
  Chip, InputAdornment, OutlinedInput,
} from '@mui/material';
import { EmojiEvents, FilterList, RestartAlt } from '@mui/icons-material';
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

const YearHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(5),
  fontWeight: 700,
  fontSize: '1.4rem',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  borderRadius: theme.spacing(2),
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  width: '100%',
  '&:hover': {
    boxShadow: '0 8px 24px -4px rgba(15,23,42,0.14)',
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
}));

function slugToOrg(slug: string, orgs: OrgRow[]): OrgRow | undefined {
  return orgs.find((o) => o.link.endsWith('/' + slug.split('/').pop()));
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const load = () => {
    setError(false);
    setLoading(true);
    Promise.all([
      fetch('/api/achievements').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/orgs').then((r) => (r.ok ? r.json() : [])),
    ]).then(([achRows, orgRows]) => {
      const enriched: Achievement[] = achRows.map((a: Achievement) => {
        const org = slugToOrg(a.org_slug, orgRows);
        return { ...a, org_name: org?.name ?? a.org_slug, logo: a.logo || org?.image || '' };
      });
      setAchievements(enriched);
      setOrgs(orgRows);
    }).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

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
  const isFiltered = selectedOrg !== 'all' || selectedYear !== 'all';
  const resetFilters = () => { setSelectedOrg('all'); setSelectedYear('all'); };

  return (
    <Box sx={{ padding: { xs: '100px 16px 48px', sm: '90px 24px 48px' } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2, px: 2.5, py: 0.8, borderRadius: 100, background: 'linear-gradient(135deg, rgba(251,146,60,0.1), rgba(244,114,182,0.07))', border: '1px solid rgba(251,146,60,0.2)' }}>
          <EmojiEvents sx={{ fontSize: 16, color: '#fb923c' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#fb923c', letterSpacing: '0.01em' }}>
            Our Pride
          </Typography>
        </Box>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' }, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'text.primary' }}>
          Achievements
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 500, mx: 'auto' }}>
          Milestones won by our clubs, teams, societies and communities.
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px" flexDirection="column" gap={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Loading achievements…</Typography>
        </Box>
      ) : error ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="error" gutterBottom>Failed to load achievements</Typography>
          <Button variant="outlined" onClick={load}>Try Again</Button>
        </Box>
      ) : (
        <>
          {/* Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <FilterList fontSize="small" />
              <Typography variant="body2" fontWeight={600}>Filter:</Typography>
            </Box>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <Select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                input={<OutlinedInput />}
                displayEmpty
              >
                {orgNames.map((c) => (
                  <MenuItem key={c} value={c}>{c === 'all' ? 'All Clubs & Teams' : c}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 130 }} size="small">
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                input={<OutlinedInput />}
                displayEmpty
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y === 'all' ? 'All Years' : y}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {isFiltered && (
              <Button
                variant="text" size="small" startIcon={<RestartAlt />}
                onClick={resetFilters}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                Reset
              </Button>
            )}
          </Box>

          {/* Result count */}
          {isFiltered && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Chip
                label={`${filtered.length} achievement${filtered.length !== 1 ? 's' : ''} found`}
                size="small"
                color={filtered.length > 0 ? 'primary' : 'default'}
                variant="outlined"
              />
            </Box>
          )}

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
                        <StyledCard variant="outlined">
                          {a.logo && (
                            <Box sx={{ width: { xs: '100%', sm: 100 }, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1.5, mb: { xs: 1, sm: 0 } }}>
                              <Box component="img"
                                sx={{ height: 'auto', maxHeight: { xs: 100, sm: 90 }, width: { xs: '70%', sm: '100%' }, objectFit: 'contain' }}
                                alt={`${a.org_name} logo`}
                                src={a.logo}
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                              />
                            </Box>
                          )}
                          <CardContent sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' }, pt: { xs: 0, sm: 2 } }}>
                            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 700, mb: 0.5 }}>
                              {a.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>
                              {a.description}
                            </Typography>
                            <Chip label={a.org_name} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                          </CardContent>
                        </StyledCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}

            {filtered.length === 0 && (
              <Box textAlign="center" py={8}>
                <EmojiEvents sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No achievements found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {isFiltered ? 'Try adjusting or resetting your filters.' : 'No achievements have been added yet.'}
                </Typography>
                {isFiltered && (
                  <Button variant="outlined" startIcon={<RestartAlt />} onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
