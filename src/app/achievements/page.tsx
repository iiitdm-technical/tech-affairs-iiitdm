"use client";

import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, Button,
  Grid, Card, CardContent, Divider,
  Chip, InputAdornment, OutlinedInput,
} from '@mui/material';
import { EmojiEvents, FilterList, RestartAlt } from '@mui/icons-material';
import { styled } from '@mui/system';
import { achievements as achievementRows, organizations } from '@/lib/data/content';

interface Achievement {
  id: number;
  org_slug: string;
  title: string;
  description: string;
  year: string;
  logo: string;
  org_name?: string;
}

const achievements: Achievement[] = achievementRows.map((achievement) => {
  const org = organizations.find((item) => item.link.endsWith(`/${achievement.org_slug.split('/').pop()}`));
  return {
    ...achievement,
    org_name: org?.name || achievement.org_slug,
    logo: achievement.logo || org?.image || '',
  };
});

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

export default function AchievementsPage() {
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

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
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 12, sm: 14 }, pb: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={800}
          letterSpacing="-0.02em"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Our Achievements
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Celebrating our student achievements, competitions won, and milestones reached by IIITDM clubs, teams, and societies.
        </Typography>
      </Box>

      <>
          {/* Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                input={<OutlinedInput />}
                displayEmpty
                startAdornment={<InputAdornment position="start"><FilterList sx={{ fontSize: 18 }} /></InputAdornment>}
              >
                <MenuItem value="all">All Organizations</MenuItem>
                {orgNames.filter((o) => o !== 'all').map((org) => (
                  <MenuItem key={org} value={org}>{org}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
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
                      <Grid size={{ xs: 12, md: 6 }} key={a.id} sx={{ display: 'flex', width: '100%' }}>
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
    </Box>
  );
}
