import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Image from 'next/image';

const stats = [
  { number: '13', label: 'Technical Clubs',  color: '#a3e635' },
  { number: '6',  label: 'Competitive Teams', color: '#4ade80' },
  { number: '10+',label: 'Esteemed Awards',   color: '#f59e0b' },
  { number: '50+',label: 'Events Annually',   color: '#86efac' },
  { number: '20+',label: 'Sponsors',           color: '#fcd34d' },
];

const About = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="about"
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
            About Us
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              mb: 2,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            Who We Are
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <Box sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '9999px',
            p: 1.5,
            border: '1px solid rgba(251,146,60,0.2)',
          }}>
            <Image alt="Institute Logo" src="/iiitdm_logo.webp" height={120} width={120} />
          </Box>
          <Typography
            variant="body1"
            sx={{
              mb: 8,
              textAlign: 'center',
              maxWidth: '680px',
              mx: 'auto',
              color: 'text.secondary',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}
          >
            Technical Affairs at IIITDM Kancheepuram is the driving force behind technical innovation and excellence.
            We foster a culture of learning, innovation, and collaboration through our diverse range of technical clubs
            and competitive teams. Our mission is to empower students with practical skills, industry exposure, and
            opportunities to showcase their talents on national and international platforms.
          </Typography>
        </motion.div>

        {/* Stats row */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            maxWidth: 1000,
            mx: 'auto',
            py: 5,
            borderTop: `1px solid ${isDark ? 'rgba(163,230,53,0.12)' : 'rgba(21,128,61,0.15)'}`,
            borderBottom: `1px solid ${isDark ? 'rgba(163,230,53,0.12)' : 'rgba(21,128,61,0.15)'}`,
          }}
        >
          {stats.map((stat, index) => (
            <Box
              key={stat.label}
              sx={{
                flex: {
                  xs: '1 1 calc(50% - 8px)',
                  md: '1 1 calc(20% - 8px)',
                },
                minWidth: { xs: '120px', md: '150px' },
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      color: stat.color,
                      mb: 1,
                      fontSize: { xs: '2rem', md: '3.2rem' },
                      letterSpacing: '-0.04em',
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 550,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: isDark ? 'rgba(241,240,245,0.28)' : 'rgba(15,23,42,0.46)',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default About;
