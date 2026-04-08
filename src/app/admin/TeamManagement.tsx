"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert, CircularProgress,
  GridLegacy as Grid, Card, CardContent, CardActions, CardMedia, Avatar, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, Upload, Person } from '@mui/icons-material';

interface TeamMember {
  id: number;
  type: string;
  name: string;
  position: string;
  image: string;
  email: string;
  linkedin: string;
  url: string;
  path: string;
  sort_order: number;
  active: string;
}

const TYPES = ['sac', 'faculty', 'social', 'core_team'];
const EMPTY: Omit<TeamMember, 'id'> = {
  type: 'sac', name: '', position: '', image: '', email: '',
  linkedin: '', url: '', path: '', sort_order: 0, active: 'Y',
};

const TYPE_LABELS: Record<string, string> = {
  sac: 'SAC (Secretary / Joint Secretary)',
  faculty: 'Faculty Heads',
  social: 'Social Media Links',
  core_team: 'Core Team Navigation',
};

// Types that show photo cards
const PHOTO_TYPES = new Set(['sac', 'faculty']);

export default function TeamManagement() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<TeamMember, 'id'>>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: TeamMember | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  const toast = (msg: string, sev: 'success' | 'error' = 'success') =>
    setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/team');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY);
    setImageFile(null);
    setDialog({ open: true, mode: 'add', item: null });
  }

  function openEdit(item: TeamMember) {
    setForm({
      type: item.type, name: item.name, position: item.position, image: item.image,
      email: item.email, linkedin: item.linkedin, url: item.url, path: item.path,
      sort_order: item.sort_order, active: item.active,
    });
    setImageFile(null);
    setDialog({ open: true, mode: 'edit', item });
  }

  async function uploadPhoto(memberId: number): Promise<string | null> {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', imageFile);
      fd.append('memberId', memberId.toString());
      const res = await fetch('/admin/api/upload/team', { method: 'POST', body: fd });
      if (res.ok) return (await res.json()).url;
      throw new Error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!form.name) return toast('Name is required', 'error');
    try {
      let memberId: number | undefined = dialog.item?.id;

      if (dialog.mode === 'add') {
        const res = await fetch('/admin/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to add');
        memberId = (await res.json()).member?.id;
      } else {
        const res = await fetch('/admin/api/team', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: dialog.item!.id }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
      }

      // Upload photo and patch image URL
      if (imageFile && memberId) {
        const url = await uploadPhoto(memberId);
        if (url) {
          await fetch('/admin/api/team', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: memberId, image: url }),
          });
        }
      }

      toast(`Entry ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return;
    const res = await fetch(`/admin/api/team?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); }
    else toast('Failed to delete', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  const grouped = TYPES.reduce((acc, t) => {
    acc[t] = items.filter((m) => m.type === t);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Tech Affairs Team</Typography>
          <Typography variant="body2" color="text.secondary">
            SAC members, faculty heads, social links, and core-team navigation.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Entry</Button>
      </Box>

      {TYPES.map((type) => (
        <Box key={type} mb={5}>
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            {TYPE_LABELS[type]} ({grouped[type].length})
          </Typography>
          {grouped[type].length === 0 && (
            <Typography color="text.secondary" fontSize="0.85rem">None yet.</Typography>
          )}

          <Grid container spacing={2}>
            {grouped[type].map((m) => (
              <Grid item xs={12} sm={6} md={PHOTO_TYPES.has(type) ? 3 : 4} key={m.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: m.active === 'Y' ? 1 : 0.5,
                }}>
                  {/* Photo card for SAC / faculty */}
                  {PHOTO_TYPES.has(type) && (
                    <Box sx={{ position: 'relative', bgcolor: 'action.hover' }}>
                      {m.image ? (
                        <CardMedia
                          component="img"
                          height="160"
                          image={m.image}
                          alt={m.name}
                          sx={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                      ) : (
                        <Box sx={{
                          height: 160,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'action.selected',
                        }}>
                          <Person sx={{ fontSize: 64, color: 'text.disabled' }} />
                        </Box>
                      )}
                      {m.active === 'N' && (
                        <Chip label="hidden" size="small" color="warning"
                          sx={{ position: 'absolute', top: 8, right: 8 }} />
                      )}
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {/* For non-photo types, show avatar inline */}
                    {!PHOTO_TYPES.has(type) && m.image && (
                      <Avatar src={m.image} sx={{ width: 48, height: 48, flexShrink: 0 }}>
                        {m.name[0]}
                      </Avatar>
                    )}
                    <Box minWidth={0} flexGrow={1}>
                      <Typography fontWeight={700} noWrap>{m.name}</Typography>
                      {m.position && (
                        <Typography variant="body2" color="text.secondary" noWrap>{m.position}</Typography>
                      )}
                      {m.email && (
                        <Typography variant="body2" fontSize="0.75rem" noWrap>{m.email}</Typography>
                      )}
                      {m.url && (
                        <Typography variant="body2" fontSize="0.75rem" noWrap color="primary.main">{m.url}</Typography>
                      )}
                      {m.path && (
                        <Typography variant="body2" fontSize="0.75rem" noWrap>{m.path}</Typography>
                      )}
                      <Box mt={0.5}>
                        <Chip label={`#${m.sort_order}`} size="small" sx={{ mr: 0.5 }} />
                        {!PHOTO_TYPES.has(type) && m.active === 'N' && (
                          <Chip label="hidden" size="small" color="warning" />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<Edit />} onClick={() => openEdit(m)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(m.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Add / Edit dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Entry' : 'Edit Entry'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select label="Type" value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                  {TYPES.map((t) => <MenuItem key={t} value={t}>{TYPE_LABELS[t]}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Sort order" value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Name" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Position / Role" value={form.position}
                onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                helperText="For SAC/faculty" />
            </Grid>

            {/* Photo upload for SAC / faculty */}
            {PHOTO_TYPES.has(form.type) && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Photo</Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="team-photo-upload"
                  type="file"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageFile(f); }}
                />
                <label htmlFor="team-photo-upload">
                  <Button variant="outlined" component="span" startIcon={<Upload />} disabled={uploading}>
                    {imageFile ? imageFile.name : 'Upload Photo'}
                  </Button>
                </label>
                {uploading && <CircularProgress size={20} sx={{ ml: 2 }} />}
                {(form.image || imageFile) && (
                  <Box mt={1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                      alt="Preview"
                      style={{
                        width: '120px', height: '120px',
                        objectFit: 'cover', objectPosition: 'top',
                        borderRadius: '8px', display: 'block',
                      }}
                    />
                  </Box>
                )}
                <TextField
                  fullWidth label="Or paste image URL" value={form.image} sx={{ mt: 1.5 }}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="/technical-affairs-team/sac/name.webp"
                  helperText="Leave blank if uploading a file above"
                />
              </Grid>
            )}

            {/* Simple image path for non-photo types */}
            {!PHOTO_TYPES.has(form.type) && (
              <Grid item xs={12}>
                <TextField fullWidth label="Image path / URL" value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="/technical-affairs-team/icon.webp" />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                helperText="For SAC members" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="LinkedIn URL" value={form.linkedin}
                onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="URL" value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                helperText="For social links (Instagram, LinkedIn, YouTube)" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Path" value={form.path}
                onChange={(e) => setForm((p) => ({ ...p, path: e.target.value }))}
                helperText="For core_team nav links e.g. /team/management" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.active === 'Y'}
                    onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked ? 'Y' : 'N' }))}
                  />
                }
                label="Active (visible on site)"
              />
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
