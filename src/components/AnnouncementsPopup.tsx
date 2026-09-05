"use client";

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Button, Typography, Box, Chip, IconButton,
} from '@mui/material';
import {
  ArrowBackIosNew, ArrowForwardIos, Close, Campaign, OpenInNew, PictureAsPdf,
} from '@mui/icons-material';
import Link from 'next/link';
import { useOrgs, slugToName } from '@/hooks/useOrgs';
import { upcomingAnnouncements } from '@/lib/data/content';

const SESSION_KEY = 'ta_announcements_seen';

export default function AnnouncementsPopup() {
  const orgs = useOrgs();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    if (upcomingAnnouncements.length > 0) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open || upcomingAnnouncements.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % upcomingAnnouncements.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [open]);

  function moveTo(index: number) {
    setActiveIndex((index + upcomingAnnouncements.length) % upcomingAnnouncements.length);
  }

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

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {upcomingAnnouncements.length > 0 && (() => {
          const announcement = upcomingAnnouncements[activeIndex];
          return (
            <Box sx={{ display: 'flex', alignItems: 'stretch', minHeight: 280 }}>
              {upcomingAnnouncements.length > 1 && (
                <IconButton
                  aria-label="Previous announcement"
                  onClick={() => moveTo(activeIndex - 1)}
                  sx={{ alignSelf: 'center', flexShrink: 0 }}
                >
                  <ArrowBackIosNew fontSize="small" />
                </IconButton>
              )}
              <Box sx={{ flex: 1, minWidth: 0, px: 2, py: 2.5 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                <Chip label={slugToName(announcement.org_slug, orgs)} size="small" color="primary" variant="outlined" />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {new Date(announcement.event_start ?? announcement.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>
              <Typography fontWeight={700} fontSize="1rem" mb={0.75}>{announcement.title}</Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{announcement.body}</Typography>
              {announcement.media_url && !announcement.media_url.startsWith('pending:') && (
                announcement.media_url.endsWith('.pdf') ? (
                  <Button
                    component="a"
                    href={announcement.media_url}
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
                    src={announcement.media_url}
                    alt="attachment"
                    sx={{ mt: 1.5, width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 2 }}
                  />
                )
              )}
              {announcement.link && (
                <Button
                  component="a"
                  href={announcement.link.startsWith('http') ? announcement.link : `https://${announcement.link}`}
                  target="_blank" rel="noopener noreferrer"
                  size="small" endIcon={<OpenInNew fontSize="small" />}
                  sx={{ mt: 1.5, px: 0, textTransform: 'none', fontWeight: 600 }}
                >
                  Learn more
                </Button>
              )}
              </Box>
              {upcomingAnnouncements.length > 1 && (
                <IconButton
                  aria-label="Next announcement"
                  onClick={() => moveTo(activeIndex + 1)}
                  sx={{ alignSelf: 'center', flexShrink: 0 }}
                >
                  <ArrowForwardIos fontSize="small" />
                </IconButton>
              )}
            </Box>
          );
        })()}
        {upcomingAnnouncements.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, pb: 1 }}>
            {upcomingAnnouncements.map((announcement, index) => (
              <IconButton
                key={announcement.id}
                aria-label={`Show announcement ${index + 1}`}
                onClick={() => moveTo(index)}
                size="small"
                sx={{ p: 0.75 }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: index === activeIndex ? 'primary.main' : 'action.disabled' }} />
              </IconButton>
            ))}
          </Box>
        )}
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
