
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface AchievementRow {
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

const ACCENT_COLORS = ['#a3e635', '#4ade80', '#f59e0b', '#86efac', '#fcd34d', '#d9f99d'];

function slugToOrg(slug: string, orgs: OrgRow[]): OrgRow | undefined {
  return orgs.find((o) => o.link.endsWith('/' + slug.split('/').pop()));
}

const Achievements = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [items, setItems] = useState<{ title: string; description: string; image: string; date: string; category: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/achievements').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/orgs').then((r) => (r.ok ? r.json() : [])),
    ]).then(([achRows, orgRows]: [AchievementRow[], OrgRow[]]) => {
      const enriched = achRows
        .map((a) => {
          const org = slugToOrg(a.org_slug, orgRows);
          return { ...a, org_name: org?.name ?? a.org_slug, logo: a.logo || org?.image || '' };
        })
        .sort((a, b) => {
          if (b.year !== a.year) return parseInt(b.year) - parseInt(a.year);
          return b.id - a.id;
        })
        .slice(0, 6)
        .map((a, i) => ({
          title: a.title,
          description: a.description,
          image: a.logo,
          date: a.year,
          category: a.org_name,
          color: ACCENT_COLORS[i % ACCENT_COLORS.length],
        }));
      setItems(enriched);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const maxIndex = items.length - 1;

  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, items.length]);

  const handlePrevious = () => { setIsAutoPlaying(false); setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1)); };
  const handleNext    = () => { setIsAutoPlaying(false); setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1)); };
  const handleDotClick = (i: number) => { setIsAutoPlaying(false); setCurrentIndex(i); };

  const current = items[currentIndex];

  return (
    <Box id="achievements" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 650, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#34d399', mb: 1.5, textAlign: 'center' }}>
            Achievements
          </Typography>
          <Typography variant="h2" component="h2" sx={{ fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' }, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.12, mb: 5, textAlign: 'center', color: 'text.primary' }}>
            Our Achievements
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
            <Skeleton variant="rounded" width={100} height={100} sx={{ borderRadius: 3.5 }} />
            <Skeleton variant="text" width={200} height={28} />
            <Skeleton variant="text" width={360} height={20} />
            <Skeleton variant="text" width={300} height={20} />
          </Box>
        ) : items.length === 0 ? null : (
          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', transition: 'transform 0.5s ease-in-out', transform: `translateX(-${currentIndex * 100}%)`, pb: 4 }}>
              {items.map((achievement, idx) => (
                <Box
                  key={`${achievement.title}-${idx}`}
                  sx={{ minWidth: '100%', boxSizing: 'border-box', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                  <Box sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, borderRadius: 3.5, background: `${achievement.color}10`, border: `1px solid ${achievement.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                    {achievement.image ? (
                      <Box component="img" src={achievement.image} alt={achievement.title} sx={{ width: { xs: 60, sm: 70 }, height: { xs: 60, sm: 70 }, objectFit: 'contain' }} />
                    ) : (
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: achievement.color }}>{achievement.category?.[0]}</Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 650, color: achievement.color, background: `${achievement.color}12`, px: 1.5, py: 0.4, borderRadius: 1.5, letterSpacing: '0.03em', mb: 1.5 }}>
                    {achievement.category}
                  </Box>

                  <Typography variant="h6" component="h3" sx={{ fontWeight: 720, color: 'text.primary', mb: 1, letterSpacing: '-0.01em' }}>
                    {achievement.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary', lineHeight: 1.65, maxWidth: 500 }}>
                    {achievement.description}
                  </Typography>
                </Box>
              ))}
            </Box>

            {items.length > 1 && (
              <>
                <IconButton onClick={handlePrevious} sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.14)'}`, backdropFilter: 'blur(8px)', '&:hover': { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)' }, zIndex: 1 }}>
                  <ArrowBackIosIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
                </IconButton>
                <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.14)'}`, backdropFilter: 'blur(8px)', '&:hover': { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)' }, zIndex: 1 }}>
                  <ArrowForwardIosIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </>
            )}

            {current && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 0.5 }}>
                {items.map((a, index) => (
                  <Box key={index} onClick={() => handleDotClick(index)} sx={{ width: index === currentIndex ? 24 : 8, height: 8, borderRadius: 4, background: index === currentIndex ? a.color : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'), cursor: 'pointer', transition: 'all 0.3s ease' }} />
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button variant="contained" size="large" href="/achievements" sx={{ px: 4, py: 1.5, fontSize: '0.95rem', borderRadius: 3.5 }}>
                View All Achievements
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Achievements;
