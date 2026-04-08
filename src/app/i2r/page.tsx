"use client";

import { useI2R } from './I2RProvider';
import { Typography, Button, Container, Box, Card, CardContent, Chip, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CalendarToday, Build, Add, AdminPanelSettings, HourglassTop, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';

interface Booking {
  booking_id: number;
  project_name: string;
  start_time: string;
  end_time: string;
  status: 'P' | 'A' | 'R';
  equipment: { name: string }[];
}

function I2RIntro() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card sx={{
      display: 'flex', flexDirection: { xs: 'column', md: 'row' },
      borderRadius: 4, overflow: 'hidden', mb: 4,
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.1)'}`,
      boxShadow: isDark ? 'none' : '0 4px 24px -6px rgba(15,23,42,0.08)',
    }}>
      <Box sx={{
        width: { xs: '100%', md: 220 }, flexShrink: 0,
        background: 'linear-gradient(135deg, #16a34a 0%, #a3e635 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: { xs: 140, md: 'auto' }, position: 'relative', overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
        },
      }}>
        <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '2.5rem', md: '3rem' }, letterSpacing: '-0.04em', position: 'relative', zIndex: 1 }}>
          I²R
        </Typography>
      </Box>
      <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={800} letterSpacing="-0.03em" gutterBottom>
          I²R Makerspace
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 1.5 }}>
          Innovative Idea to Reality (I²R) Makerspace is a collaborative hub where creativity meets technology —
          from electronics and fabrication to design and prototyping.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
          Book equipment, bring your ideas to life, and be part of IIITDM's maker community.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function I2RPage() {
  const { user } = useI2R();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch('/i2r/api/bookings')
      .then((r) => (r.ok ? r.json() : []))
      .then(setBookings)
      .catch(() => {});
  }, []);

  const pending  = bookings.filter((b) => b.status === 'P');
  const approved = bookings.filter((b) => b.status === 'A');
  // Next upcoming approved booking
  const upcoming = approved
    .filter((b) => new Date(b.end_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
      <I2RIntro />

      {/* Stats row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        {[
          { icon: <HourglassTop sx={{ color: '#fb923c' }} />, label: 'Pending Requests', value: pending.length, color: '#fb923c' },
          { icon: <CheckCircle sx={{ color: '#34d399' }} />, label: 'Approved Bookings', value: approved.length, color: '#34d399' },
          { icon: <CalendarToday sx={{ color: '#a78bfa' }} />, label: 'Total Bookings', value: bookings.length, color: '#a78bfa' },
        ].map((s) => (
          <Card key={s.label} variant="outlined" sx={{ borderRadius: 3, p: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }} onClick={() => router.push('/i2r/bookings')}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>{s.icon}</Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: s.color, letterSpacing: '-0.04em' }}>{s.value}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>{s.label}</Typography>
          </Card>
        ))}
      </Box>

      {/* Next booking */}
      {upcoming && (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 4, borderColor: 'success.main', borderLeftWidth: 4 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <CalendarToday sx={{ color: 'success.main' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>NEXT BOOKING</Typography>
              <Typography fontWeight={700}>{upcoming.project_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(upcoming.start_time), 'MMM d, yyyy · HH:mm')} → {format(new Date(upcoming.end_time), 'HH:mm')}
              </Typography>
              {upcoming.equipment.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  {upcoming.equipment.map((eq, i) => (
                    <Chip key={i} label={eq.name} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                  ))}
                </Box>
              )}
            </Box>
            <Chip label="Approved" color="success" size="small" />
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Welcome, {user.name.split(' ')[0]}!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {user.role === 'A'
              ? 'You have admin access — manage equipment, approve requests, and view all bookings.'
              : 'Book lab equipment for your projects. All requests are reviewed by the I²R admin.'}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained" size="large"
              startIcon={<Add />}
              onClick={() => router.push('/i2r/bookings?tab=new')}
              sx={{ borderRadius: 2.5, fontWeight: 700 }}
            >
              New Booking
            </Button>
            <Button
              variant="outlined" size="large"
              startIcon={<CalendarToday />}
              onClick={() => router.push('/i2r/bookings')}
              sx={{ borderRadius: 2.5, fontWeight: 600 }}
            >
              My Bookings
            </Button>
            {user.role === 'A' && (
              <Button
                variant="outlined" color="secondary" size="large"
                startIcon={<AdminPanelSettings />}
                onClick={() => router.push('/i2r/admin')}
                sx={{ borderRadius: 2.5, fontWeight: 600 }}
              >
                Admin Panel
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Build sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing="0.08em">
                HOW IT WORKS
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.7, display: 'block' }}>
              Submit a booking request → Admin reviews and approves → Use the equipment during your slot → Equipment is automatically released when your booking ends.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
