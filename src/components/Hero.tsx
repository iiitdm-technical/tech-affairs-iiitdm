import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Hero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
      {/* Ambient glow orbs */}
      <Box sx={{
        position: 'absolute', top: '12%', left: '8%',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147,197,253,0.14) 0%, transparent 70%)',
        filter: 'blur(48px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', bottom: '8%', right: '6%',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.11) 0%, transparent 70%)',
        filter: 'blur(48px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', top: '40%', right: '20%',
        width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(125,211,252,0.08) 0%, transparent 70%)',
        filter: 'blur(36px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            background: isDark
              ? 'linear-gradient(135deg, rgba(125,211,252,0.12), rgba(147,197,253,0.06))'
              : 'linear-gradient(135deg, rgba(51,73,132,0.1), rgba(31,130,177,0.06))',
            border: isDark ? '1px solid rgba(125,211,252,0.22)' : '1px solid rgba(51,73,132,0.22)',
            borderRadius: 100, px: 2.5, py: 0.8, mb: 4,
          }}>
            {/* Blinking LED dot */}
            <Box sx={{
              width: 7, height: 7, borderRadius: '50%',
              background: isDark ? '#7dd3fc' : '#1f82b1',
              boxShadow: isDark ? '0 0 8px rgba(125,211,252,0.9)' : '0 0 6px rgba(51,73,132,0.6)',
              animation: 'led-blink 2.4s ease-in-out infinite',
              '@keyframes led-blink': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.35 },
              },
            }} />
            <Typography sx={{
              fontSize: '0.8rem', fontWeight: 600,
              color: isDark ? '#7dd3fc' : '#334984',
              letterSpacing: '0.03em',
            }}>
              IIITDM Kancheepuram
            </Typography>
          </Box>

          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box
              component="img"
              src={isDark ? '/nav_logo.webp' : '/nav_logo_inv.webp'}
              alt="Logo"
              sx={{
                width: { xs: 100, md: 140 }, height: { xs: 100, md: 140 },
                filter: isDark
                  ? 'drop-shadow(0 0 28px rgba(125,211,252,0.45)) brightness(1.1)'
                  : 'none',
              }}
            />
          </Box>

          {/* Title */}
          <Typography component="h1" sx={{
            fontSize: { xs: 'clamp(2.4rem, 9vw, 3.5rem)', md: 'clamp(3rem, 6vw, 5rem)' },
            fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.0,
            color: 'text.primary', mb: 0.5,
          }}>
            Technical Affairs
          </Typography>
          <Typography component="h1" sx={{
            fontSize: { xs: 'clamp(2.4rem, 9vw, 3.5rem)', md: 'clamp(3rem, 6vw, 5rem)' },
            fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.05, mb: 3.5,
            background: isDark
              ? 'linear-gradient(135deg, #93c5fd, #7dd3fc, #f59e0b)'
              : 'linear-gradient(135deg, #334984, #1f82b1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Student Council
          </Typography>

          {/* Subtitle */}
          <Typography sx={{
            fontSize: { xs: '1rem', md: 'clamp(1rem, 2.2vw, 1.2rem)' },
            lineHeight: 1.75, color: 'text.secondary',
            maxWidth: 560, mx: 'auto', mb: 5,
          }}>
            Driving technical innovation and excellence. Explore our clubs, teams,
            societies, and communities shaping the future of technology.
          </Typography>

          {/* CTAs */}
          <Box sx={{
            display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5, justifyContent: 'center', alignItems: 'center',
          }}>
            <Button variant="contained" size="large" href="/announcements" sx={{
              px: { xs: 3, sm: 4 }, py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '0.95rem', sm: '1rem' },
              borderRadius: 3, minWidth: { xs: 220, sm: 'auto' },
              background: isDark
                ? 'linear-gradient(135deg, #1f82b1, #7dd3fc)'
                : 'linear-gradient(135deg, #334984, #1f82b1)',
              color: isDark ? '#070b18' : '#eff6ff',
              boxShadow: isDark
                ? '0 4px 20px -4px rgba(125,211,252,0.5)'
                : '0 4px 20px -4px rgba(51,73,132,0.45)',
              '&:hover': {
                background: isDark
                  ? 'linear-gradient(135deg, #1f82b1, #38bdf8)'
                  : 'linear-gradient(135deg, #283b70, #334984)',
                boxShadow: isDark
                  ? '0 8px 30px -4px rgba(125,211,252,0.6)'
                  : '0 8px 30px -4px rgba(51,73,132,0.55)',
                transform: 'translateY(-2px)',
              },
            }}>
              Latest Announcements
            </Button>
            <Button variant="outlined" size="large" href="/council" sx={{
              px: { xs: 3, sm: 4 }, py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '0.95rem', sm: '1rem' },
              borderRadius: 3, minWidth: { xs: 220, sm: 'auto' },
              borderColor: isDark ? 'rgba(125,211,252,0.3)' : 'rgba(51,73,132,0.3)',
              color: isDark ? '#7dd3fc' : '#334984',
              '&:hover': {
                borderColor: isDark ? '#7dd3fc' : '#1f82b1',
                background: isDark ? 'rgba(125,211,252,0.07)' : 'rgba(51,73,132,0.07)',
                transform: 'translateY(-1px)',
              },
            }}>
              Explore Council
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;
