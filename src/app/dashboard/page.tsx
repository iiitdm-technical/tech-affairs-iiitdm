"use client";

import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type MeResponse = {
  role: string;
  roles?: string[];
  orgSlugs?: string[];
  name?: string;
};

export default function DashboardChooserPage() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/login');
          return;
        }
        const data: MeResponse = await res.json();
        setUser(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const hasAdmin = useMemo(() => {
    if (!user) return false;
    return (Array.isArray(user.roles) && user.roles.includes('A')) || user.role === 'A';
  }, [user]);

  const hasOrgAdmin = useMemo(() => {
    if (!user) return false;
    return ((Array.isArray(user.roles) && user.roles.includes('O')) || user.role === 'O')
      && Array.isArray(user.orgSlugs)
      && user.orgSlugs.length > 0;
  }, [user]);

  useEffect(() => {
    if (loading || !user) return;
    if (hasAdmin && hasOrgAdmin) return;
    if (hasAdmin) {
      router.replace('/admin');
      return;
    }
    if (hasOrgAdmin) {
      router.replace('/org-admin');
      return;
    }
    router.replace('/');
  }, [loading, user, hasAdmin, hasOrgAdmin, router]);

  if (loading || !user) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '75vh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 520, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Choose Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You have access to multiple dashboards. Select where you want to continue.
          </Typography>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              disabled={!hasAdmin}
              onClick={() => router.push('/admin')}
            >
              Admin Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled={!hasOrgAdmin}
              onClick={() => router.push('/org-admin')}
            >
              Org Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
