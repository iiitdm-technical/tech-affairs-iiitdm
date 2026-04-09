"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Typography, Chip, IconButton, Button, Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Highlight {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  tag: string;
  sort_order: number;
}

export default function Highlights() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [items, setItems] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch('/api/highlights')
      .then((r) => r.ok ? r.json() : [])
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAuto || items.length <= 1) return;
    autoRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % items.length);
    }, 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [isAuto, items.length]);

  const prev = () => { setIsAuto(false); setCurrent((p) => (p === 0 ? items.length - 1 : p - 1)); };
  const next = () => { setIsAuto(false); setCurrent((p) => (p + 1) % items.length); };

  if (!loading && items.length === 0) return null;

  return (
    <Box id="highlights" sx={{ py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
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
            Highlights
          </Typography>
          <Typography variant="h2" component="h2" sx={{
            fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' },
            fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.12,
            mb: 5, textAlign: 'center', color: 'text.primary',
          }}>
            What&apos;s Happening
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Skeleton variant="rounded" width="100%" height={420} />
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            {/* Slides */}
            <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', height: { xs: 340, sm: 420, md: 500 } }}>
              {items.map((item, idx) => (
                <Box
                  key={item.id}
                  sx={{
                    position: 'absolute', inset: 0,
                    opacity: idx === current ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                    pointerEvents: idx === current ? 'auto' : 'none',
                  }}
                >
                  {/* Background image */}
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', display: 'block',
                    }}
                  />
                  {/* Gradient overlay */}
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                  }} />
                  {/* Content */}
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    p: { xs: 3, md: 5 },
                  }}>
                    {item.tag && (
                      <Chip
                        label={item.tag}
                        size="small"
                        sx={{
                          mb: 1.5, fontSize: '0.68rem', fontWeight: 650,
                          bgcolor: 'rgba(245,158,11,0.85)', color: '#030a06',
                          border: 'none',
                        }}
                      />
                    )}
                    <Typography variant="h4" fontWeight={800} color="white" sx={{
                      fontSize: { xs: '1.4rem', md: '1.9rem' },
                      letterSpacing: '-0.025em', lineHeight: 1.2, mb: 0.8,
                    }}>
                      {item.title}
                    </Typography>
                    {item.subtitle && (
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem',
                        lineHeight: 1.6, mb: item.link ? 2 : 0, maxWidth: 560,
                      }}>
                        {item.subtitle}
                      </Typography>
                    )}
                    {item.link && (
                      <Button
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: '0.85rem' }} />}
                        sx={{
                          mt: 0.5, borderRadius: 2, fontSize: '0.8rem', fontWeight: 650,
                          borderColor: 'rgba(255,255,255,0.4)', color: 'white',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                        }}
                      >
                        Learn More
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Arrows */}
            {items.length > 1 && (
              <>
                <IconButton onClick={prev} sx={{
                  position: 'absolute', left: { xs: 8, md: 16 }, top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.45)', color: 'white',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' }, zIndex: 2,
                }}>
                  <ArrowBackIosIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
                </IconButton>
                <IconButton onClick={next} sx={{
                  position: 'absolute', right: { xs: 8, md: 16 }, top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.45)', color: 'white',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' }, zIndex: 2,
                }}>
                  <ArrowForwardIosIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </>
            )}

            {/* Dot indicators */}
            {items.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 2.5 }}>
                {items.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => { setIsAuto(false); setCurrent(i); }}
                    sx={{
                      width: i === current ? 24 : 8, height: 8, borderRadius: 4,
                      background: i === current
                        ? '#f59e0b'
                        : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
