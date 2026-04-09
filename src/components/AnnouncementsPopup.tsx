"use client";

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Divider, IconButton,
} from '@mui/material';
import { Close, Campaign, OpenInNew, PictureAsPdf } from '@mui/icons-material';
import Link from 'next/link';
import { useOrgs, slugToName } from '@/hooks/useOrgs';

const SESSION_KEY = 'ta_announcements_seen';

interface Announcement {
  id: number;
  org_slug: string;
  title: string;
  body: string;
  link: string;
  media_url: string;
  created_at: string;
}

export default function AnnouncementsPopup() {
  const orgs = useOrgs();
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    fetch('/api/announcements')
      .then(async (res) => {
        if (!res.ok) return;
        const text = await res.text();
        if (!text) return;
        try {
          const data: Announcement[] = JSON.parse(text);
          if (data.length > 0) {
            setAnnouncements(data);
            setOpen(true);
          }
        } catch {}
      })
      .catch(() => {});
  }, []);

  function handleClose() {
    sessionStorage.setItem(SESSION_KEY, '1');
    setOpen(false);
  }

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.6)' } } }}
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', maxHeight: '80vh', backgroundImage: 'none', bgcolor: 'background.paper' },
      }}
    >
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 100%)',
        px: 3, py: 2,
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <Campaign sx={{ color: '#fff', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={800} color="#fff" sx={{ flexGrow: 1 }}>
          Announcements
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: '#fff' }}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
        {announcements.map((a, i) => (
          <Box key={a.id}>
            {i > 0 && <Divider />}
            <Box sx={{ px: 3, py: 2.5 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                <Chip label={slugToName(a.org_slug, orgs)} size="small" color="primary" variant="outlined" />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>
              <Typography fontWeight={700} fontSize="1rem" mb={0.75}>{a.title}</Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{a.body}</Typography>
              {a.media_url && !a.media_url.startsWith('pending:') && (
                a.media_url.endsWith('.pdf') ? (
                  <Button
                    component="a"
                    href={a.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<PictureAsPdf fontSize="small" />}
                    color="error"
                    variant="outlined"
                    sx={{ mt: 1.5, textTransform: 'none', borderRadius: 2 }}
                  >
                    View PDF
                  </Button>
                ) : (
                  <Box
                    component="img"
                    src={a.media_url}
                    alt="attachment"
                    sx={{ mt: 1.5, width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 2 }}
                  />
                )
              )}
              {a.link && (
                <Button
                  component="a"
                  href={a.link.startsWith('http') ? a.link : `https://${a.link}`}
                  target="_blank" rel="noopener noreferrer"
                  size="small" endIcon={<OpenInNew fontSize="small" />}
                  sx={{ mt: 1.5, px: 0, textTransform: 'none', fontWeight: 600 }}
                >
                  Learn more
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button component={Link} href="/announcements" variant="outlined" size="small"
          onClick={handleClose} sx={{ borderRadius: 2, textTransform: 'none' }}>
          View all
        </Button>
        <Button variant="contained" size="small" onClick={handleClose}
          sx={{ borderRadius: 2, textTransform: 'none' }}>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
