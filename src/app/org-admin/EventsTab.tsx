"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, GridLegacy as Grid, CircularProgress,
  Card, CardContent, CardActions, CardMedia, Chip, MenuItem, Select,
  FormControl, InputLabel, LinearProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add, Edit, Delete, CloudUpload, Image as ImageIcon } from '@mui/icons-material';
import { format } from 'date-fns';

interface OrgEvent {
  event_id: number;
  club_id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  link: string;
  requirements: string;
  imageUrl?: string;
  club_name?: string;
}

interface Club {
  club_id: number;
  name: string;
}

const EMPTY_FORM = {
  club_id: 0,
  name: '', description: '', location: '', link: '', requirements: '',
  start_time: null as Date | null,
  end_time: null as Date | null,
  imageUrl: '',
};

export default function EventsTab({ orgSlugs }: { orgSlugs: string[] }) {
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; event: OrgEvent | null }>({
    open: false, mode: 'add', event: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedEventId, setUploadedEventId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = (msg: string, sev: 'success' | 'error' = 'success') =>
    setSnack({ open: true, msg, sev });

  async function load() {
    const [evRes, clubRes] = await Promise.all([
      fetch('/org-admin/api/events'),
      fetch('/org-admin/api/clubs'),
    ]);
    if (evRes.ok) setEvents(await evRes.json());
    if (clubRes.ok) setClubs(await clubRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({ ...EMPTY_FORM, club_id: clubs[0]?.club_id ?? 0 });
    setUploadedEventId(null);
    setDialog({ open: true, mode: 'add', event: null });
  }

  function openEdit(ev: OrgEvent) {
    setForm({
      club_id: ev.club_id,
      name: ev.name, description: ev.description, location: ev.location,
      link: ev.link, requirements: ev.requirements,
      start_time: new Date(ev.start_time), end_time: new Date(ev.end_time),
      imageUrl: ev.imageUrl ?? '',
    });
    setUploadedEventId(ev.event_id);
    setDialog({ open: true, mode: 'edit', event: ev });
  }

  async function handleSubmit() {
    if (!form.name || !form.description || !form.location || !form.start_time || !form.end_time) {
      return toast('Please fill in all required fields', 'error');
    }
    if (!form.club_id) return toast('Please select a club', 'error');

    const payload = {
      club_id: form.club_id,
      name: form.name, description: form.description, location: form.location,
      link: form.link, requirements: form.requirements,
      start_time: form.start_time.toISOString(),
      end_time: form.end_time.toISOString(),
      imageUrl: form.imageUrl || null,
      ...(dialog.mode === 'edit' && { event_id: dialog.event!.event_id }),
    };
    const res = await fetch('/org-admin/api/events', {
      method: dialog.mode === 'add' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      // If image was selected but event was just created, upload now
      if (dialog.mode === 'add' && fileInputRef.current?.files?.[0] && data.event?.event_id) {
        await uploadImage(fileInputRef.current.files[0], data.event.event_id);
      }
      toast(`Event ${dialog.mode === 'add' ? 'created' : 'updated'}`);
      setDialog({ open: false, mode: 'add', event: null });
      load();
    } else {
      const d = await res.json();
      toast(d.error || 'Something went wrong', 'error');
    }
  }

  async function uploadImage(file: File, eventId: number) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('eventId', String(eventId));
    const res = await fetch('/org-admin/api/upload/event', { method: 'POST', body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setForm(p => ({ ...p, imageUrl: url }));
      // Patch imageUrl onto the event immediately
      await fetch('/org-admin/api/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, imageUrl: url }),
      });
      toast('Image uploaded');
      return url;
    } else {
      toast('Image upload failed', 'error');
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (dialog.mode === 'edit' && uploadedEventId) {
      const url = await uploadImage(file, uploadedEventId);
      if (url) load();
    } else {
      // For add mode, preview the name; actual upload happens on submit
      setForm(p => ({ ...p, imageUrl: `pending:${file.name}` }));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this event?')) return;
    const res = await fetch(`/org-admin/api/events?event_id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Event deleted'); load(); }
    else toast('Failed to delete', 'error');
  }

  function status(s: string, e: string) {
    const now = Date.now();
    const start = new Date(s).getTime();
    const end = new Date(e).getTime();
    if (now < start) return { label: 'Upcoming', color: 'info' as const };
    if (now <= end) return { label: 'Ongoing', color: 'success' as const };
    return { label: 'Completed', color: 'default' as const };
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>Events</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd} disabled={clubs.length === 0}>
          Add Event
        </Button>
      </Box>

      {clubs.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No clubs are linked to your organisation yet. Ask the super-admin to link a club to your org slug.
        </Alert>
      )}

      {events.length === 0 && clubs.length > 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No events yet. Click "Add Event" to create your first one.
        </Typography>
      )}

      <Grid container spacing={3}>
        {events.map((ev) => {
          const st = status(ev.start_time, ev.end_time);
          return (
            <Grid item xs={12} sm={6} md={4} key={ev.event_id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {ev.imageUrl && !ev.imageUrl.startsWith('pending:') && (
                  <CardMedia component="img" height="140" image={ev.imageUrl} alt={ev.name} sx={{ objectFit: 'cover' }} />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" fontSize="1rem" fontWeight={700}>{ev.name}</Typography>
                    <Chip label={st.label} color={st.color} size="small" />
                  </Box>
                  {ev.club_name && <Chip label={ev.club_name} size="small" variant="outlined" sx={{ mb: 1 }} />}
                  <Typography variant="body2" color="text.secondary" gutterBottom>{ev.description}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {ev.location}</Typography>
                  <Typography variant="body2"><strong>Start:</strong> {format(new Date(ev.start_time), 'MMM dd, yyyy HH:mm')}</Typography>
                  <Typography variant="body2"><strong>End:</strong> {format(new Date(ev.end_time), 'MMM dd, yyyy HH:mm')}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<Edit />} onClick={() => openEdit(ev)}>Edit</Button>
                  <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(ev.event_id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Event' : 'Edit Event'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Club</InputLabel>
                <Select
                  value={form.club_id || ''}
                  label="Club"
                  onChange={(e) => setForm(p => ({ ...p, club_id: Number(e.target.value) }))}
                >
                  {clubs.map((c) => (
                    <MenuItem key={c.club_id} value={c.club_id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Event Name" value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required multiline rows={3} label="Description" value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker label="Start Time *" value={form.start_time}
                onChange={(v) => setForm(p => ({ ...p, start_time: v }))}
                slotProps={{ textField: { fullWidth: true } }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker label="End Time *" value={form.end_time}
                onChange={(v) => setForm(p => ({ ...p, end_time: v }))}
                slotProps={{ textField: { fullWidth: true } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Location" value={form.location}
                onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Event Link (optional)" value={form.link}
                onChange={(e) => setForm(p => ({ ...p, link: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Requirements (optional)" value={form.requirements}
                onChange={(e) => setForm(p => ({ ...p, requirements: e.target.value }))} />
            </Grid>

            {/* Image upload */}
            <Grid item xs={12}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  size="small"
                >
                  {uploading ? 'Uploading…' : 'Event Image'}
                </Button>
                {form.imageUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ImageIcon fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main">
                      {form.imageUrl.startsWith('pending:')
                        ? form.imageUrl.replace('pending:', '') + ' (will upload on save)'
                        : 'Image set'}
                    </Typography>
                  </Box>
                )}
              </Box>
              {uploading && <LinearProgress sx={{ mt: 1 }} />}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
            {dialog.mode === 'add' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}
