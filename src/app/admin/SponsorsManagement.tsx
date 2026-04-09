"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert, CircularProgress,
  GridLegacy as Grid, Card, CardContent, CardActions, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website: string;
  tier: string;
  year: string;
  sort_order: number;
  active: string;
}

const TIERS = ['title', 'gold', 'silver', 'general'];
const TIER_LABELS: Record<string, string> = { title: 'Title', gold: 'Gold', silver: 'Silver', general: 'General / Partner' };
const EMPTY: Omit<Sponsor, 'id'> = { name: '', logo: '', website: '', tier: 'general', year: '2025-26', sort_order: 0, active: 'Y' };

export default function SponsorsManagement() {
  const [items, setItems] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Sponsor, 'id'>>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Sponsor | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });
  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/sponsors');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY); setImageFile(null); setImagePreview(null);
    setDialog({ open: true, mode: 'add', item: null });
  }
  function openEdit(item: Sponsor) {
    setForm({ name: item.name, logo: item.logo, website: item.website, tier: item.tier, year: item.year, sort_order: item.sort_order, active: item.active });
    setImageFile(null); setImagePreview(item.logo || null);
    setDialog({ open: true, mode: 'edit', item });
  }

  async function uploadLogo(): Promise<string | null> {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', imageFile);
      const res = await fetch('/admin/api/upload/sponsor', { method: 'POST', body: fd });
      if (res.ok) return (await res.json()).url;
      throw new Error('Upload failed');
    } finally { setUploading(false); }
  }

  async function handleSubmit() {
    if (!form.name) return toast('Name is required', 'error');
    if (!form.logo && !imageFile) return toast('Logo is required', 'error');
    try {
      let logoUrl = form.logo;
      if (imageFile) {
        const url = await uploadLogo();
        if (!url) throw new Error('Logo upload failed');
        logoUrl = url;
      }
      const payload = { ...form, logo: logoUrl };

      if (dialog.mode === 'add') {
        const res = await fetch('/admin/api/sponsors', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
      } else {
        const res = await fetch('/admin/api/sponsors', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: dialog.item!.id }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      }
      toast(`Sponsor ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } catch (err) { toast(err instanceof Error ? err.message : 'Error', 'error'); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this sponsor?')) return;
    const res = await fetch(`/admin/api/sponsors?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); } else toast('Failed', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Sponsors</Typography>
          <Typography variant="body2" color="text.secondary">Manage sponsor logos shown on the homepage</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Sponsor</Button>
      </Box>

      {items.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>No sponsors yet. Add some to show them on the homepage.</Typography>
      )}

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card sx={{ opacity: item.active === 'Y' ? 1 : 0.5 }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, bgcolor: 'action.hover' }}>
                <Box component="img" src={item.logo} alt={item.name}
                  sx={{ maxWidth: '100%', maxHeight: 60, objectFit: 'contain' }} />
              </Box>
              <CardContent sx={{ py: 1 }}>
                <Typography fontWeight={700} fontSize="0.85rem" noWrap>{item.name}</Typography>
                <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                  <Chip label={TIER_LABELS[item.tier]} size="small" color="warning" variant="outlined" />
                  {item.year && <Chip label={item.year} size="small" />}
                  {item.active === 'N' && <Chip label="hidden" size="small" />}
                </Box>
              </CardContent>
              <CardActions sx={{ pt: 0 }}>
                <Button size="small" startIcon={<Edit />} onClick={() => openEdit(item)}>Edit</Button>
                <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(item.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Sponsor' : 'Edit Sponsor'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth required label="Sponsor Name" value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Year" value={form.year}
                onChange={(e) => setForm(p => ({ ...p, year: e.target.value }))}
                placeholder="2025-26" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tier</InputLabel>
                <Select label="Tier" value={form.tier}
                  onChange={(e) => setForm(p => ({ ...p, tier: e.target.value }))}>
                  {TIERS.map((t) => <MenuItem key={t} value={t}>{TIER_LABELS[t]}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Sort Order" value={form.sort_order}
                onChange={(e) => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Website URL" value={form.website}
                onChange={(e) => setForm(p => ({ ...p, website: e.target.value }))}
                placeholder="https://sponsor.com" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" mb={1}>Logo</Typography>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  setImageFile(f); setImagePreview(URL.createObjectURL(f));
                }} />
              <Button variant="outlined" startIcon={<CloudUpload />} size="small"
                onClick={() => fileInputRef.current?.click()}>
                {imageFile ? imageFile.name : 'Upload Logo'}
              </Button>
              {imagePreview && (
                <Box mt={1.5} p={2} bgcolor="action.hover" borderRadius={2} display="flex" justifyContent="center">
                  <Box component="img" src={imagePreview} alt="Preview"
                    sx={{ maxWidth: 180, maxHeight: 80, objectFit: 'contain' }} />
                </Box>
              )}
              {!imageFile && (
                <TextField fullWidth label="Or paste logo URL" value={form.logo} sx={{ mt: 1.5 }}
                  onChange={(e) => { setForm(p => ({ ...p, logo: e.target.value })); setImagePreview(e.target.value); }} />
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
