"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, GridLegacy as Grid, CircularProgress,
  Card, CardContent, CardActions, Chip,
} from '@mui/material';
import { Add, Edit, Delete, Upload } from '@mui/icons-material';

interface Club {
  club_id: number;
  name: string;
  iconUrl: string;
  authorized_email: string;
  org_slug: string;
}

const EMPTY_FORM = { name: '', iconUrl: '', authorized_email: '', org_slug: '' };

export default function ClubsManagement() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; club: Club | null }>({
    open: false, mode: 'add', club: null,
  });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const toast = (message: string, severity: 'success' | 'error' = 'success') =>
    setSnack({ open: true, message, severity });

  const fetchClubs = useCallback(async () => {
    const res = await fetch('/admin/api/clubs');
    if (res.ok) setClubs(await res.json());
    else toast('Failed to fetch clubs', 'error');
    setLoading(false);
  }, []);

  useEffect(() => { fetchClubs(); }, [fetchClubs]);

  function openAdd() {
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setDialog({ open: true, mode: 'add', club: null });
  }

  function openEdit(club: Club) {
    setFormData({
      name: club.name,
      iconUrl: club.iconUrl || '',
      authorized_email: club.authorized_email || '',
      org_slug: club.org_slug || '',
    });
    setImageFile(null);
    setDialog({ open: true, mode: 'edit', club });
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this club? This will also revoke the org admin access for its email.')) return;
    const res = await fetch(`/admin/api/clubs?club_id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Club deleted'); fetchClubs(); }
    else toast('Failed to delete', 'error');
  }

  async function uploadImage(clubId: number): Promise<string | null> {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', imageFile);
      fd.append('clubId', clubId.toString());
      const res = await fetch('/admin/api/upload/club', { method: 'POST', body: fd });
      if (res.ok) return (await res.json()).url;
      throw new Error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!formData.name) return toast('Club name is required', 'error');
    if (formData.authorized_email && !formData.authorized_email.endsWith('@iiitdm.ac.in'))
      return toast('Email must be @iiitdm.ac.in', 'error');
    if (formData.authorized_email && !formData.org_slug)
      return toast('Org slug is required when email is set', 'error');

    try {
      let clubId = dialog.club?.club_id;

      if (dialog.mode === 'add') {
        const res = await fetch('/admin/api/clubs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            authorized_email: formData.authorized_email,
            org_slug: formData.org_slug,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to add');
        clubId = (await res.json()).club.club_id;
      } else {
        const res = await fetch('/admin/api/clubs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            club_id: dialog.club!.club_id,
            name: formData.name,
            authorized_email: formData.authorized_email,
            org_slug: formData.org_slug,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
      }

      // Upload image and patch iconUrl
      if (imageFile && clubId) {
        const url = await uploadImage(clubId);
        if (url) {
          await fetch('/admin/api/clubs', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ club_id: clubId, iconUrl: url }),
          });
        }
      }

      toast(`Club ${dialog.mode === 'add' ? 'added' : 'updated'} successfully`);
      setDialog({ open: false, mode: 'add', club: null });
      fetchClubs();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    }
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Clubs Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Each club can have one authorized email — they get org-admin access on login.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openAdd}>Add Club</Button>
      </Box>

      {clubs.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>No clubs yet.</Typography>
      )}

      <Grid container spacing={3}>
        {clubs.map((club) => (
          <Grid item xs={12} sm={6} md={4} key={club.club_id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Fixed-height image box so logos don't blow up */}
              <Box sx={{
                height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'action.hover', overflow: 'hidden',
                borderRadius: '4px 4px 0 0',
              }}>
                {club.iconUrl ? (
                  <Box component="img" src={club.iconUrl} alt={club.name}
                    sx={{ maxWidth: '80%', maxHeight: '140px', objectFit: 'contain' }} />
                ) : (
                  <Typography color="text.disabled" fontSize="0.8rem">No image</Typography>
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>{club.name}</Typography>
                {club.org_slug && (
                  <Chip label={club.org_slug} size="small" variant="outlined" sx={{ mb: 0.5, mr: 0.5 }} />
                )}
                {club.authorized_email ? (
                  <Typography variant="body2" color="text.secondary" fontSize="0.78rem">
                    {club.authorized_email}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="warning.main" fontSize="0.78rem">
                    No authorized email set
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Edit />} onClick={() => openEdit(club)}>Edit</Button>
                <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(club.club_id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Club' : 'Edit Club'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth required label="Club Name" value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
            />
            <TextField
              fullWidth label="Authorized Email" value={formData.authorized_email}
              onChange={(e) => setFormData(p => ({ ...p, authorized_email: e.target.value }))}
              placeholder="csclub@iiitdm.ac.in"
              helperText="This email gets org-admin access to manage this club's events & achievements"
            />
            <TextField
              fullWidth label="Org Slug" value={formData.org_slug}
              onChange={(e) => setFormData(p => ({ ...p, org_slug: e.target.value }))}
              placeholder="clubs/cs"
              helperText="URL path segment e.g. clubs/cs, teams/nira, societies/ieee"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>Club Logo</Typography>
              <input accept="image/*" style={{ display: 'none' }} id="icon-upload" type="file"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageFile(f); }} />
              <label htmlFor="icon-upload">
                <Button variant="outlined" component="span" startIcon={<Upload />} disabled={uploading}>
                  {imageFile ? imageFile.name : 'Upload Logo'}
                </Button>
              </label>
              {uploading && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Box>
            {(formData.iconUrl || imageFile) && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Preview:</Typography>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : formData.iconUrl}
                  alt="Preview"
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', display: 'block' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
            {dialog.mode === 'add' ? 'Add Club' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}
