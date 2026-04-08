import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Techfest = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="techfest"
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            sx={{
              fontSize: '0.72rem',
              fontWeight: 650,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#a3e635',
              mb: 1.5,
              textAlign: 'center',
            }}
          >
            Annual Event
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' },
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              mb: 2,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            Savāra 2026
          </Typography>
        </motion.div>

        <Box
          sx={{
            maxWidth: 700,
            mx: 'auto',
            mt: 4,
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            background: isDark
              ? 'linear-gradient(145deg, rgba(163,230,53,0.06), rgba(74,222,128,0.03))'
              : 'linear-gradient(145deg, rgba(21,128,61,0.06), rgba(74,222,128,0.04))',
            border: `1px solid ${isDark ? 'rgba(163,230,53,0.15)' : 'rgba(21,128,61,0.18)'}`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              sx={{
                mb: 2.5,
                color: 'text.secondary',
                fontSize: '1.05rem',
                lineHeight: 1.8,
              }}
            >
              Join us for Savāra 2026, the flagship techno-cultural fest of IIITDM Kancheepuram, a five-day celebration of innovation, creativity, and culture.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography
              sx={{
                mb: 4,
                color: 'text.secondary',
                fontSize: '1.05rem',
                lineHeight: 1.8,
              }}
            >
              The fest brings together 5,000+ bright minds from top institutions across India, uniting engineers, designers, and creators on one dynamic stage.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="contained"
              size="large"
              href="https://savara.in/"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '0.95rem',
                borderRadius: 3.5,
                background: 'linear-gradient(135deg, #16a34a, #a3e635)',
                color: '#030a06',
                boxShadow: '0 4px 18px -3px rgba(163,230,53,0.45)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #15803d, #84cc16)',
                  boxShadow: '0 6px 24px -3px rgba(163,230,53,0.55)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Explore Savāra
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Techfest;
