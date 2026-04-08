"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Snackbar, Alert,
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, CircularProgress, Chip,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useOrgs } from '@/hooks/useOrgs';

interface OrgAdmin {
  id: number;
  email: string;
  org_slug: string;
}

export default function OrgAdminsManagement() {
  const allOrgs = useOrgs();
  const ALL_SLUGS = allOrgs.map((o) => ({ slug: o.link.split('/').pop()!, name: o.name }));
  const [rows, setRows] = useState<OrgAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    const res = await fetch('/admin/api/org-admins');
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!email || !orgSlug) return toast('Email and org slug are required', 'error');
    if (!email.endsWith('@iiitdm.ac.in')) return toast('Must be an @iiitdm.ac.in address', 'error');

    const res = await fetch('/admin/api/org-admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, org_slug: orgSlug }),
    });
    if (res.ok) {
      toast('Org admin added. They will be redirected to /org-admin on next login.');
      setDialogOpen(false);
      setEmail('');
      setOrgSlug('');
      load();
    } else {
      const d = await res.json();
      toast(d.error || 'Failed to add', 'error');
    }
  }

  async function handleDelete(row: OrgAdmin) {
    if (!confirm(`Remove ${row.email} from ${row.org_slug}?`)) return;
    const res = await fetch(`/admin/api/org-admins?id=${row.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: row.email }),
    });
    if (res.ok) { toast('Removed'); load(); }
    else toast('Failed to remove', 'error');
  }

  if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Org Admins</Typography>
          <Typography variant="body2" color="text.secondary">
            Grant a club/team/society email address access to its own dashboard.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          Add Org Admin
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Org Slug</strong></TableCell>
              <TableCell><strong>Org Name</strong></TableCell>
              <TableCell align="right"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary" py={2}>No org admins yet.</Typography>
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => {
              const org = ALL_SLUGS.find((o) => o.slug === r.org_slug);
              return (
                <TableRow key={r.id}>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>
                    <Chip label={r.org_slug} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{org?.name ?? r.org_slug}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleDelete(r)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Add Org Admin</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth label="Email (@iiitdm.ac.in)" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="csclub@iiitdm.ac.in"
            />
            <TextField
              fullWidth
              label="Org Slug"
              value={orgSlug}
              onChange={(e) => setOrgSlug(e.target.value)}
              placeholder="cs"
              helperText={`Available: ${ALL_SLUGS.map((o) => o.slug).join(', ')}`}
              FormHelperTextProps={{ sx: { fontSize: '0.72rem' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
