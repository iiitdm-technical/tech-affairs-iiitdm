"use client";

import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import HandshakeIcon from '@mui/icons-material/Handshake';

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website: string;
  tier: string;
  year: string;
}

const TIER_ORDER = ['title', 'gold', 'silver', 'general'];
const TIER_LABELS: Record<string, string> = {
  title: 'Title Sponsor',
  gold: 'Gold Sponsors',
  silver: 'Silver Sponsors',
  general: 'Partners',
};
const TIER_LOGO_SIZE: Record<string, number> = {
  title: 140,
  gold: 110,
  silver: 88,
  general: 72,
};

export default function SponsorsSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sponsors')
      .then((r) => r.ok ? r.json() : [])
      .then(setSponsors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && sponsors.length === 0) {
    // Show "Become a Sponsor" CTA even with no sponsors
    return <BecomeSponsorCTA isDark={isDark} />;
  }

  const grouped = TIER_ORDER.reduce((acc, t) => {
    acc[t] = sponsors.filter((s) => s.tier === t);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  return (
    <Box id="sponsors" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography sx={{
            fontSize: '0.72rem', fontWeight: 650, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#f59e0b', mb: 1.5, textAlign: 'center',
          }}>
            Our Sponsors
          </Typography>
          <Typography variant="h2" component="h2" sx={{
            fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' },
            fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.12,
            mb: 2, textAlign: 'center', color: 'text.primary',
          }}>
            Powered by Great Partners
          </Typography>
          <Typography sx={{
            fontSize: '1rem', color: 'text.secondary', textAlign: 'center',
            maxWidth: 500, mx: 'auto', mb: 7, lineHeight: 1.7,
          }}>
            We&apos;re grateful to the organizations that support technical innovation at IIITDM Kancheepuram.
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rounded" width={120} height={60} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : (
          <>
            {TIER_ORDER.map((tier) => {
              const group = grouped[tier];
              if (!group || group.length === 0) return null;
              const logoSize = TIER_LOGO_SIZE[tier];
              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography sx={{
                    fontSize: '0.68rem', fontWeight: 650, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'text.secondary',
                    textAlign: 'center', mb: 3,
                  }}>
                    {TIER_LABELS[tier]}
                  </Typography>
                  <Box sx={{
                    display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 },
                    justifyContent: 'center', alignItems: 'center', mb: 6,
                  }}>
                    {group.map((sponsor) => (
                      <Box
                        key={sponsor.id}
                        component={sponsor.website ? 'a' : 'div'}
                        href={sponsor.website || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          p: 2.5, borderRadius: 3,
                          minWidth: 100, maxWidth: logoSize + 40,
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)'}`,
                          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                          transition: 'all 0.25s ease',
                          textDecoration: 'none',
                          cursor: sponsor.website ? 'pointer' : 'default',
                          '&:hover': sponsor.website ? {
                            border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.4)'}`,
                            background: isDark ? 'rgba(245,158,11,0.05)' : 'rgba(245,158,11,0.04)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px -4px rgba(245,158,11,0.2)',
                          } : {},
                        }}
                      >
                        <Box
                          component="img"
                          src={sponsor.logo}
                          alt={sponsor.name}
                          sx={{
                            maxWidth: logoSize,
                            maxHeight: logoSize * 0.5,
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            display: 'block',
                            filter: isDark ? 'brightness(0.9) saturate(0.8)' : 'none',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              );
            })}
          </>
        )}

        <BecomeSponsorCTA isDark={isDark} />
      </Container>
    </Box>
  );
}

function BecomeSponsorCTA({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{
        mt: 4,
        mx: 'auto',
        maxWidth: 640,
        p: { xs: 4, md: 6 },
        borderRadius: 5,
        textAlign: 'center',
        background: isDark
          ? 'linear-gradient(145deg, rgba(245,158,11,0.07), rgba(251,146,60,0.04))'
          : 'linear-gradient(145deg, rgba(245,158,11,0.08), rgba(251,146,60,0.05))',
        border: `1px solid ${isDark ? 'rgba(245,158,11,0.18)' : 'rgba(245,158,11,0.25)'}`,
      }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: '50%', mx: 'auto', mb: 2.5,
          bgcolor: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HandshakeIcon sx={{ color: '#f59e0b', fontSize: '1.6rem' }} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="text.primary" mb={1.5} letterSpacing="-0.025em">
          Become a Sponsor
        </Typography>
        <Typography sx={{
          color: 'text.secondary', fontSize: '1rem',
          lineHeight: 1.75, maxWidth: 480, mx: 'auto', mb: 3.5,
        }}>
          Partner with Technical Affairs IIITDM to reach 5,000+ students and connect your brand with technical innovation, Savāra, and our flagship clubs & teams.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="mailto:technical.affairs@iiitdm.ac.in?subject=Sponsorship Inquiry"
          sx={{
            px: 4, py: 1.5, borderRadius: 3.5, fontWeight: 700,
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            color: '#030a06',
            boxShadow: '0 4px 18px -3px rgba(245,158,11,0.45)',
            '&:hover': {
              background: 'linear-gradient(135deg, #b45309, #d97706)',
              boxShadow: '0 6px 24px -3px rgba(245,158,11,0.55)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Get in Touch
        </Button>
      </Box>
    </motion.div>
  );
}
