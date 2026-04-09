"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert, CircularProgress,
  GridLegacy as Grid, Card, CardMedia, CardContent, CardActions, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';

interface Highlight {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  tag: string;
  sort_order: number;
  active: string;
}

const EMPTY: Omit<Highlight, 'id'> = {
  title: '', subtitle: '', image: '', link: '', tag: '', sort_order: 0, active: 'Y',
};

export default function HighlightsManagement() {
  const [items, setItems] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Highlight, 'id'>>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Highlight | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });
  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/highlights');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY); setImageFile(null); setImagePreview(null);
    setDialog({ open: true, mode: 'add', item: null });
  }
  function openEdit(item: Highlight) {
    setForm({ title: item.title, subtitle: item.subtitle, image: item.image, link: item.link, tag: item.tag, sort_order: item.sort_order, active: item.active });
    setImageFile(null); setImagePreview(item.image || null);
    setDialog({ open: true, mode: 'edit', item });
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', imageFile);
      const res = await fetch('/admin/api/upload/highlight', { method: 'POST', body: fd });
      if (res.ok) return (await res.json()).url;
      throw new Error('Upload failed');
    } finally { setUploading(false); }
  }

  async function handleSubmit() {
    if (!form.title) return toast('Title is required', 'error');
    if (!form.image && !imageFile) return toast('Image is required', 'error');
    try {
      let imageUrl = form.image;
      if (imageFile) {
        const url = await uploadImage();
        if (!url) throw new Error('Image upload failed');
        imageUrl = url;
      }
      const payload = { ...form, image: imageUrl };

      if (dialog.mode === 'add') {
        const res = await fetch('/admin/api/highlights', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
      } else {
        const res = await fetch('/admin/api/highlights', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: dialog.item!.id }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      }
      toast(`Highlight ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } catch (err) { toast(err instanceof Error ? err.message : 'Error', 'error'); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this highlight?')) return;
    const res = await fetch(`/admin/api/highlights?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); } else toast('Failed', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Highlights</Typography>
          <Typography variant="body2" color="text.secondary">
            Media & Marketing team — external programs, events, reels
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Highlight</Button>
      </Box>

      {items.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>No highlights yet.</Typography>
      )}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: item.active === 'Y' ? 1 : 0.5 }}>
              <CardMedia component="img" height={160} image={item.image} alt={item.title} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                  {item.tag && <Chip label={item.tag} size="small" color="warning" variant="outlined" />}
                  <Chip label={`#${item.sort_order}`} size="small" />
                  {item.active === 'N' && <Chip label="hidden" size="small" color="default" />}
                </Box>
                <Typography fontWeight={700} mb={0.5}>{item.title}</Typography>
                {item.subtitle && <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>}
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
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Highlight' : 'Edit Highlight'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Title" value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Subtitle / Caption" value={form.subtitle}
                onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Tag" value={form.tag}
                onChange={(e) => setForm(p => ({ ...p, tag: e.target.value }))}
                placeholder="Workshop, Vaidehi, External..." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Sort Order" value={form.sort_order}
                onChange={(e) => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Link (optional)" value={form.link}
                onChange={(e) => setForm(p => ({ ...p, link: e.target.value }))}
                placeholder="https://..." />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Image <Typography component="span" color="error">*</Typography>
              </Typography>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  setImageFile(f); setImagePreview(URL.createObjectURL(f));
                }} />
              <Button variant="outlined" startIcon={<CloudUpload />} size="small"
                onClick={() => fileInputRef.current?.click()}>
                {imageFile ? imageFile.name : 'Upload Image'}
              </Button>
              {imagePreview && (
                <Box mt={1.5}>
                  <Box component="img" src={imagePreview} alt="Preview"
                    sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 1.5 }} />
                </Box>
              )}
              {!imageFile && (
                <TextField fullWidth label="Or paste image URL" value={form.image} sx={{ mt: 1.5 }}
                  onChange={(e) => { setForm(p => ({ ...p, image: e.target.value })); setImagePreview(e.target.value); }} />
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={form.active === 'Y'}
                  onChange={(e) => setForm(p => ({ ...p, active: e.target.checked ? 'Y' : 'N' }))} />}
                label="Active (visible on homepage)" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
            {uploading ? <CircularProgress size={20} /> : (dialog.mode === 'add' ? 'Add' : 'Update')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
