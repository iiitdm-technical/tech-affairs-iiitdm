"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert, CircularProgress,
  GridLegacy as Grid, Card, CardContent, CardActions, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useOrgs } from '@/hooks/useOrgs';

interface Achievement {
  id: number;
  org_slug: string;
  title: string;
  description: string;
  year: string;
  proof_url: string;
  logo: string;
}

const EMPTY = { org_slug: '', title: '', description: '', year: new Date().getFullYear().toString(), proof_url: '', logo: '' };

export default function AchievementsManagement() {
  const allOrgs = useOrgs();
  const ALL_SLUGS = allOrgs.map((o) => o.link.split('/').pop()!);
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: Achievement | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/achievements');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setForm(EMPTY); setDialog({ open: true, mode: 'add', item: null }); }
  function openEdit(item: Achievement) {
    setForm({ org_slug: item.org_slug, title: item.title, description: item.description, year: item.year, proof_url: item.proof_url, logo: item.logo });
    setDialog({ open: true, mode: 'edit', item });
  }

  async function handleSubmit() {
    if (!form.org_slug || !form.title || !form.description || !form.year) {
      return toast('org_slug, title, description, and year are required', 'error');
    }
    const payload = { ...form, ...(dialog.mode === 'edit' && { id: dialog.item!.id }) };
    const res = await fetch('/admin/api/achievements', {
      method: dialog.mode === 'add' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast(`Achievement ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } else {
      const d = await res.json();
      toast(d.error || 'Something went wrong', 'error');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this achievement?')) return;
    const res = await fetch(`/admin/api/achievements?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); }
    else toast('Failed', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>Achievements</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add</Button>
      </Box>

      {items.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>No achievements in the database yet.</Typography>
      )}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                  <Chip label={item.org_slug} size="small" color="primary" variant="outlined" />
                  <Chip label={item.year} size="small" />
                </Box>
                <Typography variant="h6" fontSize="0.95rem" fontWeight={700} mb={0.5}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                {item.proof_url && (
                  <Typography variant="body2" mt={1}>
                    <a href={item.proof_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                      Proof ↗
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
            <Grid item xs={12} md={8}>
              <TextField fullWidth required label="Org Slug" value={form.org_slug}
                onChange={(e) => setForm(p => ({ ...p, org_slug: e.target.value }))}
                helperText={`e.g. ${ALL_SLUGS.slice(0, 4).join(', ')}…`} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth required label="Year" value={form.year}
                onChange={(e) => setForm(p => ({ ...p, year: e.target.value }))} inputProps={{ maxLength: 4 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Title" value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required multiline rows={3} label="Description" value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Proof URL (optional)" value={form.proof_url}
                onChange={(e) => setForm(p => ({ ...p, proof_url: e.target.value }))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{dialog.mode === 'add' ? 'Add' : 'Update'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
