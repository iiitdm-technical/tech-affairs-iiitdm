import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Hero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getLogoSrc = () => {
    return isDark ? '/nav_logo.webp' : '/nav_logo_inv.webp';
  };

  return (
    <Box
      id="hero"
      sx={{
        mt: 0.5,
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        pt: { xs: 12, md: 2 },
        pb: { xs: 4, md: 6 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              background: 'linear-gradient(135deg, rgba(251,146,60,0.12), rgba(244,114,182,0.08))',
              border: '1px solid rgba(251,146,60,0.2)',
              borderRadius: 100,
              px: 2.5,
              py: 0.8,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#fb923c',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 550,
                color: '#fb923c',
                letterSpacing: '0.01em',
              }}
            >
              IIITDM Kancheepuram
            </Typography>
          </Box>

          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box
              component="img"
              src={getLogoSrc()}
              alt="Logo"
              sx={{ width: { xs: 100, md: 140 }, height: { xs: 100, md: 140 } }}
            />
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 'clamp(2.4rem, 9vw, 3.5rem)', md: 'clamp(3rem, 6vw, 5rem)' },
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 1.0,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            Technical Affairs
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 'clamp(2.4rem, 9vw, 3.5rem)', md: 'clamp(3rem, 6vw, 5rem)' },
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 1.05,
              mb: 3.5,
              background: 'linear-gradient(135deg, #fb923c, #f472b6, #a78bfa, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Student Council
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: 'clamp(1rem, 2.2vw, 1.25rem)' },
              lineHeight: 1.75,
              color: 'text.secondary',
              maxWidth: 580,
              mx: 'auto',
              mb: 5,
            }}
          >
            Driving technical innovation and excellence. Explore our clubs, teams,
            societies, and communities shaping the future of technology.
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              href="/announcements"
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '0.95rem', sm: '1rem' },
                borderRadius: 3.5,
                minWidth: { xs: 220, sm: 'auto' },
                background: 'linear-gradient(135deg, #fb923c, #f472b6)',
                boxShadow: '0 4px 14px -3px rgba(251,146,60,0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ea7c28, #ec4899)',
                  boxShadow: '0 6px 20px -3px rgba(251,146,60,0.5)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Latest Announcements
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="/council"
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '0.95rem', sm: '1rem' },
                borderRadius: 3.5,
                minWidth: { xs: 220, sm: 'auto' },
                borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.14)',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#fb923c',
                  background: 'rgba(251,146,60,0.06)',
                },
              }}
            >
              Explore Council
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;
