"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert, CircularProgress,
  GridLegacy as Grid, Card, CardContent, CardActions, CardMedia, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

interface Org {
  id: number;
  name: string;
  image: string;
  link: string;
  category: string;
  sort_order: number;
}

const CATEGORIES = ['club', 'team', 'society', 'community'];
const EMPTY: Omit<Org, 'id'> = { name: '', image: '', link: '', category: 'club', sort_order: 0 };

export default function OrgsManagement() {
  const [items, setItems] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Org, 'id'>>(EMPTY);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Org | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({ open: false, msg: '', sev: 'success' });

  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/orgs');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setDialog({ open: true, mode: 'add', item: null }); }
  function openEdit(item: Org) {
    setForm({ name: item.name, image: item.image, link: item.link, category: item.category, sort_order: item.sort_order });
    setDialog({ open: true, mode: 'edit', item });
  }

  async function handleSubmit() {
    if (!form.name || !form.link || !form.category) return toast('name, link, category required', 'error');
    const payload = { ...form, ...(dialog.mode === 'edit' && { id: dialog.item!.id }) };
    const res = await fetch('/admin/api/orgs', {
      method: dialog.mode === 'add' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast(`Org ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } else {
      toast((await res.json()).error || 'Something went wrong', 'error');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this org?')) return;
    const res = await fetch(`/admin/api/orgs?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); }
    else toast('Failed', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter((o) => o.category === cat);
    return acc;
  }, {} as Record<string, Org[]>);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Organisations</Typography>
          <Typography variant="body2" color="text.secondary">
            All clubs, teams, societies and communities displayed site-wide.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Org</Button>
      </Box>

      {CATEGORIES.map((cat) => (
        <Box key={cat} mb={4}>
          <Typography variant="subtitle1" fontWeight={700} textTransform="capitalize" mb={1.5}>
            {cat}s ({grouped[cat].length})
          </Typography>
          {grouped[cat].length === 0 && (
            <Typography color="text.secondary" fontSize="0.85rem">None yet.</Typography>
          )}
          <Grid container spacing={2}>
            {grouped[cat].map((org) => (
              <Grid item xs={12} sm={6} md={4} key={org.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {org.image && (
                    <CardMedia component="img" height="80" image={org.image} alt={org.name}
                      sx={{ objectFit: 'contain', pt: 1, px: 1 }} />
                  )}
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography fontWeight={700} gutterBottom>{org.name}</Typography>
                    <Chip label={org.category} size="small" variant="outlined" sx={{ mr: 0.5 }} />
                    <Chip label={`#${org.sort_order}`} size="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary" fontSize="0.78rem" mt={0.5}>
                      {org.link}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<Edit />} onClick={() => openEdit(org)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(org.id)}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

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
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Link (URL path)" value={form.link}
                placeholder="/clubs/cs"
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Logo image path" value={form.image}
                placeholder="/clubs/csclub/logo.webp"
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Sort order" value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{dialog.mode === 'add' ? 'Add' : 'Update'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
