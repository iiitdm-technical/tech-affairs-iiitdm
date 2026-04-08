"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert, CircularProgress,
  GridLegacy as Grid, Card, CardContent, CardActions, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Add, Edit, Delete, Upload } from '@mui/icons-material';

interface Org {
  id: number;
  name: string;
  image: string;
  link: string;
  category: string;
  sort_order: number;
  authorized_email?: string;
}

const CATEGORIES = ['club', 'team', 'society', 'community'];
const EMPTY: Omit<Org, 'id'> = { name: '', image: '', link: '', category: 'club', sort_order: 0, authorized_email: '' };

const CAT_COLORS: Record<string, string> = {
  club: '#a3e635', team: '#4ade80', society: '#f59e0b', community: '#86efac',
};

export default function OrgsManagement() {
  const [items, setItems] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [form, setForm] = useState<Omit<Org, 'id'>>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Org | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/orgs');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const displayed = activeCategory === 'all' ? items : items.filter((o) => o.category === activeCategory);

  function openAdd() {
    setForm({ ...EMPTY, category: activeCategory === 'all' ? 'club' : activeCategory });
    setImageFile(null);
    setDialog({ open: true, mode: 'add', item: null });
  }

  function openEdit(item: Org) {
    setForm({
      name: item.name, image: item.image, link: item.link, category: item.category,
      sort_order: item.sort_order, authorized_email: item.authorized_email || '',
    });
    setImageFile(null);
    setDialog({ open: true, mode: 'edit', item });
  }

  async function uploadLogo(orgId: number): Promise<string | null> {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', imageFile);
      fd.append('orgId', orgId.toString());
      const res = await fetch('/admin/api/upload/org', { method: 'POST', body: fd });
      if (res.ok) return (await res.json()).url;
      throw new Error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!form.name || !form.link || !form.category) return toast('Name, link and category are required', 'error');
    if (form.authorized_email && !form.authorized_email.endsWith('@iiitdm.ac.in'))
      return toast('Email must be @iiitdm.ac.in', 'error');
    try {
      let orgId: number | undefined = dialog.item?.id;

      if (dialog.mode === 'add') {
        const res = await fetch('/admin/api/orgs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to add');
        orgId = (await res.json()).org?.id;
      } else {
        const res = await fetch('/admin/api/orgs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: dialog.item!.id }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
      }

      if (imageFile && orgId) {
        const url = await uploadLogo(orgId);
        if (url) {
          await fetch('/admin/api/orgs', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: orgId, image: url }),
          });
        }
      }

      toast(`Org ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this org?')) return;
    const res = await fetch(`/admin/api/orgs?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); }
    else toast('Failed to delete', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  // Category counts
  const counts = CATEGORIES.reduce((acc, c) => { acc[c] = items.filter((o) => o.category === c).length; return acc; }, {} as Record<string, number>);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Organisations</Typography>
          <Typography variant="body2" color="text.secondary">
            Clubs, teams, societies and communities — set logo, link, and admin email.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Org</Button>
      </Box>

      {/* Category filter chips */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
        <Chip
          label={`All (${items.length})`}
          onClick={() => setActiveCategory('all')}
          color={activeCategory === 'all' ? 'primary' : 'default'}
          variant={activeCategory === 'all' ? 'filled' : 'outlined'}
        />
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={`${cat}s (${counts[cat] || 0})`}
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? 'filled' : 'outlined'}
            sx={{
              textTransform: 'capitalize',
              ...(activeCategory === cat && {
                bgcolor: CAT_COLORS[cat], color: '#030a06', borderColor: CAT_COLORS[cat],
              }),
            }}
          />
        ))}
      </Box>

      {displayed.length === 0 && (
        <Typography color="text.secondary" fontSize="0.85rem">None yet.</Typography>
      )}

      <Grid container spacing={2}>
        {displayed.map((org) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={org.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{
                height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'action.hover', p: 1.5, overflow: 'hidden',
                borderRadius: '4px 4px 0 0',
              }}>
                {org.image ? (
                  <Box component="img" src={org.image} alt={org.name}
                    sx={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                ) : (
                  <Typography color="text.disabled" fontSize="0.75rem" textAlign="center">No logo</Typography>
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, pb: 1, px: 1.5 }}>
                <Typography fontWeight={700} fontSize="0.82rem" gutterBottom noWrap title={org.name}>
                  {org.name}
                </Typography>
                <Chip
                  label={org.category} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5,
                    fontSize: '0.65rem', borderColor: CAT_COLORS[org.category], color: CAT_COLORS[org.category],
                  }}
                />
                {org.authorized_email ? (
                  <Typography variant="body2" color="success.main" fontSize="0.7rem" noWrap>
                    ✓ {org.authorized_email.split('@')[0]}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="warning.main" fontSize="0.7rem">
                    No admin email
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ px: 1, pt: 0 }}>
                <Button size="small" startIcon={<Edit />} onClick={() => openEdit(org)}>Edit</Button>
                <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(org.id)}>
                  Del
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Org' : 'Edit Org'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth required label="Name" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select label="Category" value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Link (URL path)" value={form.link}
                placeholder="/clubs/cs"
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Admin Email" value={form.authorized_email || ''}
                onChange={(e) => setForm((p) => ({ ...p, authorized_email: e.target.value }))}
                placeholder="csclub@iiitdm.ac.in"
                helperText="This email gets org-admin access to manage events & achievements" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Logo</Typography>
              <input accept="image/*" style={{ display: 'none' }} id="org-logo-upload" type="file"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageFile(f); }} />
              <label htmlFor="org-logo-upload">
                <Button variant="outlined" component="span" startIcon={<Upload />} disabled={uploading}>
                  {imageFile ? imageFile.name : 'Upload Logo'}
                </Button>
              </label>
              {uploading && <CircularProgress size={20} sx={{ ml: 2 }} />}
              {(form.image || imageFile) && (
                <Box mt={1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                    alt="Preview"
                    style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', display: 'block' }}
                  />
                </Box>
              )}
              <TextField fullWidth label="Or paste logo URL / path" value={form.image} sx={{ mt: 1.5 }}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="/clubs/csclub/logo.webp"
                helperText="Leave blank if uploading above" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Sort order" value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
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

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
