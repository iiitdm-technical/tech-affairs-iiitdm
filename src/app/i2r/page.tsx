"use client";

import { Box, Button, Card, CardContent, Container, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Build, DesignServices, ElectricalServices, Email, FactCheck } from '@mui/icons-material';
import { i2rInfo } from '@/lib/data/content';

const facilityIcons = [<Build key="fabrication" />, <ElectricalServices key="electronics" />, <DesignServices key="design" />];

export default function I2RPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: 4, overflow: 'hidden', mb: 4, border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.1)'}`, boxShadow: isDark ? 'none' : '0 4px 24px -6px rgba(15,23,42,0.08)' }}>
        <Box sx={{ width: { xs: '100%', md: 220 }, flexShrink: 0, background: 'linear-gradient(135deg, #1f82b1 0%, #7dd3fc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: { xs: 140, md: 'auto' }, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)' } }}>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '2.5rem', md: '3rem' }, letterSpacing: '-0.04em', position: 'relative', zIndex: 1 }}>
            {i2rInfo.mark}
          </Typography>
        </Box>
        <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" fontWeight={800} letterSpacing="-0.03em" gutterBottom>{i2rInfo.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 1.5 }}>{i2rInfo.description}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>{i2rInfo.summary}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight={800} mb={2}>What You Can Explore</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        {i2rInfo.facilities.map((facility, index) => (
          <Card key={facility.title} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ color: ['#fb923c', '#34d399', '#a78bfa'][index], mb: 1.5 }}>{facilityIcons[index]}</Box>
              <Typography fontWeight={700} gutterBottom>{facility.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{facility.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <FactCheck color="primary" />
            <Typography variant="h6" fontWeight={700}>Accessing the Makerspace</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box component="ol" sx={{ m: 0, pl: 3, color: 'text.secondary' }}>
            {i2rInfo.process.map((step) => (
              <Typography component="li" variant="body2" key={step} sx={{ mb: 1.5, pl: 1, lineHeight: 1.7 }}>{step}</Typography>
            ))}
          </Box>
          <Button variant="contained" startIcon={<Email />} href={`mailto:${i2rInfo.contactEmail}?subject=I2R Makerspace Enquiry`} sx={{ mt: 2, borderRadius: 2.5, fontWeight: 700 }}>
            Contact the I²R Team
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
