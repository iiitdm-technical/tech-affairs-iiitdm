"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, GridLegacy as Grid, CircularProgress,
  Card, CardContent, CardActions, Chip, LinearProgress,
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload, Image as ImageIcon } from '@mui/icons-material';

interface Achievement {
  id: number;
  org_slug: string;
  title: string;
  description: string;
  year: string;
  proof_url: string;
  logo: string;
  image: string;
}

const EMPTY = { title: '', description: '', year: new Date().getFullYear().toString(), proof_url: '', logo: '', image: '' };

export default function AchievementsTab({ orgSlugs }: { orgSlugs: string[] }) {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Achievement | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });
  const [uploading, setUploading] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });
  const defaultSlug = orgSlugs[0] ?? '';

  async function load() {
    const res = await fetch('/org-admin/api/achievements');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY);
    setSavedId(null);
    setDialog({ open: true, mode: 'add', item: null });
  }

  function openEdit(item: Achievement) {
    setForm({ title: item.title, description: item.description, year: item.year, proof_url: item.proof_url, logo: item.logo, image: item.image ?? '' });
    setSavedId(item.id);
    setDialog({ open: true, mode: 'edit', item });
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.year) return toast('Title, description, and year are required', 'error');

    const payload = {
      org_slug: dialog.mode === 'edit' ? dialog.item!.org_slug : defaultSlug,
      ...form,
      ...(dialog.mode === 'edit' && { id: dialog.item!.id }),
    };

    const res = await fetch('/org-admin/api/achievements', {
      method: dialog.mode === 'add' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      const achId = dialog.mode === 'add' ? data.achievement?.id : dialog.item!.id;
      // Upload pending image for new achievements
      if (dialog.mode === 'add' && fileInputRef.current?.files?.[0] && achId) {
        await uploadImage(fileInputRef.current.files[0], achId);
      }
      toast(`Achievement ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } else {
      const d = await res.json();
      toast(d.error || 'Something went wrong', 'error');
    }
  }

  async function uploadImage(file: File, id: number): Promise<string | undefined> {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('achievementId', String(id));
    const res = await fetch('/org-admin/api/upload/achievement', { method: 'POST', body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setForm(p => ({ ...p, image: url }));
      // Patch image onto achievement immediately
      await fetch('/org-admin/api/achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, image: url }),
      });
      toast('Photo uploaded');
      return url;
    } else {
      toast('Photo upload failed', 'error');
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (dialog.mode === 'edit' && savedId) {
      const url = await uploadImage(file, savedId);
      if (url) load();
    } else {
      setForm(p => ({ ...p, image: `pending:${file.name}` }));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this achievement?')) return;
    const res = await fetch(`/org-admin/api/achievements?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); }
    else toast('Failed to delete', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>Achievements</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Achievement</Button>
      </Box>

      {items.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No achievements yet. Click "Add Achievement" to get started.
        </Typography>
      )}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {item.image && !item.image.startsWith('pending:') && (
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" fontSize="0.95rem" fontWeight={700}>{item.title}</Typography>
                  <Chip label={item.year} size="small" color="primary" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>{item.description}</Typography>
                {item.proof_url && (
                  <Typography variant="body2">
                    <a href={item.proof_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                      View proof ↗
                    </a>
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Edit />} onClick={() => openEdit(item)}>Edit</Button>
                <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(item.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Achievement' : 'Edit Achievement'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Title" value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required multiline rows={3} label="Description" value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth required label="Year" value={form.year}
                onChange={(e) => setForm(p => ({ ...p, year: e.target.value }))}
                inputProps={{ maxLength: 4 }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Proof URL (optional)" value={form.proof_url}
                onChange={(e) => setForm(p => ({ ...p, proof_url: e.target.value }))} />
            </Grid>

            {/* Competition photo upload */}
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
                  {uploading ? 'Uploading…' : 'Competition Photo'}
                </Button>
                {form.image && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ImageIcon fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main">
                      {form.image.startsWith('pending:')
                        ? form.image.replace('pending:', '') + ' (will upload on save)'
                        : 'Photo set'}
                    </Typography>
                  </Box>
                )}
              </Box>
              {uploading && <LinearProgress sx={{ mt: 1 }} />}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Shown in the homepage achievements carousel
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
            {dialog.mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
