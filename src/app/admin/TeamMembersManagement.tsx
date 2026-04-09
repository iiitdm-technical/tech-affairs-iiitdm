"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert, CircularProgress,
  GridLegacy as Grid, Card, CardContent, CardActions, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel,
  Tabs, Tab,
} from '@mui/material';
import { Add, Edit, Delete, Upload, Person as PersonIcon, OpenInNew } from '@mui/icons-material';

interface TeamMember {
  id: number;
  team_slug: string;
  sub_role: string;
  name: string;
  roll: string;
  email: string;
  linkedin: string;
  image: string;
  sort_order: number;
  active: string;
}

const TEAM_SLUGS = ['management', 'innovation', 'media-and-marketing', 'social-outreach', 'tech-development'];
const SUB_ROLES = ['core', 'jt-core', 'coordinator'];
const SLUG_LABELS: Record<string, string> = {
  'management': 'Management',
  'innovation': 'Innovation',
  'media-and-marketing': 'Media & Marketing',
  'social-outreach': 'Social Outreach',
  'tech-development': 'Tech Development',
};
const SUBROLE_LABELS: Record<string, string> = {
  core: 'Core',
  'jt-core': 'Joint Core',
  coordinator: 'Coordinator',
};

const EMPTY: Omit<TeamMember, 'id'> = {
  team_slug: 'management', sub_role: 'coordinator', name: '', roll: '',
  email: '', linkedin: '', image: '', sort_order: 0, active: 'Y',
};

export default function TeamMembersManagement() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<Omit<TeamMember, 'id'>>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; item: TeamMember | null }>({
    open: false, mode: 'add', item: null,
  });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/team-members');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const currentSlug = TEAM_SLUGS[activeTab];
  const teamMembers = items.filter((m) => m.team_slug === currentSlug);

  function openAdd() {
    setForm({ ...EMPTY, team_slug: currentSlug });
    setImageFile(null);
    setDialog({ open: true, mode: 'add', item: null });
  }

  function openEdit(item: TeamMember) {
    setForm({
      team_slug: item.team_slug, sub_role: item.sub_role, name: item.name, roll: item.roll,
      email: item.email, linkedin: item.linkedin, image: item.image,
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
      const res = await fetch('/admin/api/upload/team-member', { method: 'POST', body: fd });
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
        const res = await fetch('/admin/api/team-members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        memberId = data.member?.id;
      } else {
        const res = await fetch('/admin/api/team-members', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: dialog.item!.id }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      }

      if (imageFile && memberId) {
        const url = await uploadPhoto(memberId);
        if (url) {
          await fetch('/admin/api/team-members', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: memberId, image: url }),
          });
        }
      }

      toast(`Member ${dialog.mode === 'add' ? 'added' : 'updated'}`);
      setDialog({ open: false, mode: 'add', item: null });
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this member?')) return;
    const res = await fetch(`/admin/api/team-members?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); }
    else toast('Failed', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;

  // Group by sub_role
  const grouped = SUB_ROLES.reduce((acc, r) => {
    acc[r] = teamMembers.filter((m) => m.sub_role === r);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          Core Team Members — {SLUG_LABELS[currentSlug]}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            size="small" variant="outlined" startIcon={<OpenInNew />}
            href={`/team/${currentSlug}`} target="_blank" rel="noopener noreferrer"
          >
            View Page
          </Button>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={openAdd}>
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Team tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {TEAM_SLUGS.map((slug) => (
          <Tab key={slug} label={SLUG_LABELS[slug]}
            sx={{ fontSize: '0.8rem', minWidth: 'auto', px: 2 }} />
        ))}
      </Tabs>

      {teamMembers.length === 0 && (
        <Typography color="text.secondary" fontSize="0.85rem" py={2}>
          No members yet for {SLUG_LABELS[currentSlug]}.
        </Typography>
      )}

      {SUB_ROLES.map((role) => {
        const group = grouped[role];
        if (!group || group.length === 0) return null;
        return (
          <Box key={role} mb={3}>
            <Typography variant="body2" fontWeight={700} color="text.secondary" mb={1} textTransform="uppercase"
              fontSize="0.7rem" letterSpacing="0.08em">
              {SUBROLE_LABELS[role]} ({group.length})
            </Typography>
            <Grid container spacing={2}>
              {group.map((m) => (
                <Grid item xs={6} sm={4} md={3} key={m.id}>
                  <Card sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    opacity: m.active === 'Y' ? 1 : 0.5,
                  }}>
                    <Box sx={{
                      height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: 'action.hover', overflow: 'hidden', borderRadius: '4px 4px 0 0',
                    }}>
                      {m.image ? (
                        <Box component="img" src={m.image} alt={m.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                      ) : (
                        <PersonIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pb: 0.5, px: 1.5 }}>
                      <Typography fontWeight={700} fontSize="0.82rem" noWrap>{m.name}</Typography>
                      {m.roll && (
                        <Chip label={m.roll} size="small" variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 18, mt: 0.5 }} />
                      )}
                      {m.active === 'N' && (
                        <Chip label="hidden" size="small" color="warning" sx={{ ml: 0.5 }} />
                      )}
                    </CardContent>
                    <CardActions sx={{ px: 1, pt: 0 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => openEdit(m)}>Edit</Button>
                      <Button size="small" color="error" startIcon={<Delete />}
                        onClick={() => handleDelete(m.id)}>Del</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}

      {/* Add/Edit dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'add' ? 'Add Member' : 'Edit Member'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Team</InputLabel>
                <Select label="Team" value={form.team_slug}
                  onChange={(e) => setForm((p) => ({ ...p, team_slug: e.target.value }))}>
                  {TEAM_SLUGS.map((s) => <MenuItem key={s} value={s}>{SLUG_LABELS[s]}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select label="Role" value={form.sub_role}
                  onChange={(e) => setForm((p) => ({ ...p, sub_role: e.target.value }))}>
                  {SUB_ROLES.map((r) => <MenuItem key={r} value={r}>{SUBROLE_LABELS[r]}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth required label="Name" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Sort order" value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Roll Number" value={form.roll}
                onChange={(e) => setForm((p) => ({ ...p, roll: e.target.value }))}
                placeholder="CS24I1029" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="LinkedIn URL" value={form.linkedin}
                onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Photo</Typography>
              <input accept="image/*" style={{ display: 'none' }} id="team-member-photo-upload" type="file"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageFile(f); }} />
              <label htmlFor="team-member-photo-upload">
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
                    style={{ width: 100, height: 100, objectFit: 'cover', objectPosition: 'top', borderRadius: 8 }}
                  />
                </Box>
              )}
              <TextField fullWidth label="Or paste image URL" value={form.image} sx={{ mt: 1.5 }}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="/technical-affairs-team/management/cores/name.webp"
                helperText="Leave blank if uploading above" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch checked={form.active === 'Y'}
                    onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked ? 'Y' : 'N' }))} />
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
