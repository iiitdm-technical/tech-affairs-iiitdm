"use client";

import {
  Box, Typography, Container, Card, CardContent, Chip, Divider,
  Button,
} from '@mui/material';
import { Campaign, OpenInNew } from '@mui/icons-material';
import { useOrgs, slugToName, slugToLogo } from '@/hooks/useOrgs';
import { announcements as items } from '@/lib/data/content';

export default function AnnouncementsPage() {
  const orgs = useOrgs();
  return (
    <Box sx={{ pt: { xs: 12, md: 14 }, pb: 8, minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: 2,
            background: 'linear-gradient(135deg, #1f82b1, #7dd3fc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Campaign sx={{ color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">Announcements</Typography>
            <Typography variant="body2" color="text.secondary">Latest updates from clubs, teams & societies</Typography>
          </Box>
        </Box>

        {items.length === 0 && (
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
                      {item.media_url && !item.media_url.startsWith('pending:') && (
                        <Box
                          component="img"
                          src={item.media_url}
                          alt={`${item.title} poster`}
                          sx={{ mt: 2, width: '100%', maxHeight: 520, objectFit: 'contain', borderRadius: 2, display: 'block' }}
                        />
                      )}
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
