"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Card, CardContent, Chip, Divider,
  Button, CircularProgress,
} from '@mui/material';
import { Campaign, OpenInNew } from '@mui/icons-material';
import { useOrgs, slugToName, slugToLogo } from '@/hooks/useOrgs';

interface Announcement {
  id: number;
  org_slug: string;
  title: string;
  body: string;
  link: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const orgs = useOrgs();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(async (res) => {
        if (!res.ok) return;
        const text = await res.text();
        if (text) try { setItems(JSON.parse(text)); } catch {}
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ pt: { xs: 12, md: 14 }, pb: 8, minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: 2,
            background: 'linear-gradient(135deg, #16a34a, #a3e635)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Campaign sx={{ color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">Announcements</Typography>
            <Typography variant="body2" color="text.secondary">Latest updates from clubs, teams & societies</Typography>
          </Box>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
        )}

        {!loading && items.length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={8}>
            No announcements at the moment. Check back soon!
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((item, i) => {
            const logo = slugToLogo(item.org_slug, orgs);
            const name = slugToName(item.org_slug, orgs);
            return (
              <Card key={item.id} variant="outlined" sx={{ borderRadius: 3, transition: 'box-shadow 0.15s', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    {logo && (
                      <Box component="img" src={logo} alt={name}
                        sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 1, flexShrink: 0, mt: 0.25 }} />
                    )}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.75} flexWrap="wrap">
                        <Chip label={name} size="small" color="primary" variant="outlined" />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                      </Box>
                      <Typography fontWeight={700} fontSize="1rem" gutterBottom>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.body}</Typography>
                      {item.link && (
                        <Button
                          component="a" href={item.link.startsWith('http') ? item.link : `https://${item.link}`} target="_blank" rel="noopener noreferrer"
                          size="small" endIcon={<OpenInNew fontSize="small" />}
                          sx={{ mt: 1, px: 0, textTransform: 'none', fontWeight: 600 }}
                        >
                          Learn more
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
