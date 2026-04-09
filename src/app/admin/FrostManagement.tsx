"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Chip, Button, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Snackbar,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip,
} from '@mui/material';
import {
  CheckCircle, Cancel, Delete, OpenInNew, HourglassEmpty, FilterList,
} from '@mui/icons-material';

interface Contribution {
  id: number;
  page_path: string;
  page_title: string;
  title: string;
  body: string;
  author_name: string;
  author_email: string;
  status: string;
  reviewed_by: string;
  reviewed_at: string | null;
  created_at: string;
  deleted_at: string | null;
  deleted_by: string;
}

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

export default function FrostManagement() {
  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewItem, setViewItem] = useState<Contribution | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success',
  });

  const toast = (msg: string, sev: 'success' | 'error' = 'success') => setSnack({ open: true, msg, sev });

  async function load() {
    setLoading(true);
    const res = await fetch('/admin/api/frost');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleReview(id: number, status: 'approved' | 'rejected') {
    const res = await fetch('/admin/api/frost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast(`Contribution ${status}`);
      setViewItem(null);
      load();
    } else {
      toast('Action failed', 'error');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this contribution? (soft delete — logged in audit trail)')) return;
    const res = await fetch(`/admin/api/frost?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Deleted'); load(); }
    else toast('Delete failed', 'error');
  }

  const displayed = filter === 'all' ? items : items.filter(i => i.status === filter);
  const pendingCount = items.filter(i => i.status === 'pending' && !i.deleted_at).length;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>FROST Contributions</Typography>
          <Typography variant="body2" color="text.secondary">
            Community-submitted additions to FROST documentation. Review before they go live.
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          {pendingCount > 0 && (
            <Chip
              label={`${pendingCount} pending`}
              color="warning"
              size="small"
              icon={<HourglassEmpty fontSize="small" />}
            />
          )}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              startAdornment={<FilterList fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />}
            >
              <MenuItem value="all">All ({items.length})</MenuItem>
              <MenuItem value="pending">Pending ({items.filter(i => i.status === 'pending').length})</MenuItem>
              <MenuItem value="approved">Approved ({items.filter(i => i.status === 'approved').length})</MenuItem>
              <MenuItem value="rejected">Rejected ({items.filter(i => i.status === 'rejected').length})</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : displayed.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={6}>
          No contributions found.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 40 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Page</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Reviewed by</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    opacity: item.deleted_at ? 0.4 : 1,
                    bgcolor: item.status === 'pending' && !item.deleted_at
                      ? 'rgba(245,158,11,0.03)'
                      : 'inherit',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>{item.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem' }}>
                        {item.author_name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontSize="0.8rem" fontWeight={600} lineHeight={1.2}>
                          {item.author_name}
                        </Typography>
                        <Typography fontSize="0.7rem" color="text.disabled">{item.author_email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography fontSize="0.8rem">{item.page_title}</Typography>
                      <Tooltip title={item.page_path}>
                        <OpenInNew
                          fontSize="small"
                          sx={{ fontSize: '0.75rem', color: 'text.disabled', cursor: 'pointer' }}
                          onClick={() => window.open(item.page_path, '_blank')}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontSize="0.8rem"
                      sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
                      onClick={() => setViewItem(item)}
                    >
                      {item.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.deleted_at ? (
                      <Chip label="deleted" size="small" color="default" />
                    ) : (
                      <Chip label={item.status} size="small" color={STATUS_COLOR[item.status] ?? 'default'} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.reviewed_by ? (
                      <Typography fontSize="0.75rem" color="text.secondary">{item.reviewed_by}</Typography>
                    ) : item.deleted_at ? (
                      <Typography fontSize="0.75rem" color="text.disabled">deleted by {item.deleted_by}</Typography>
                    ) : (
                      <Typography fontSize="0.75rem" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      {item.status === 'pending' && !item.deleted_at && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton size="small" color="success" onClick={() => handleReview(item.id, 'approved')}>
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton size="small" color="error" onClick={() => handleReview(item.id, 'rejected')}>
                              <Cancel fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {!item.deleted_at && (
                        <Tooltip title="Delete (logged)">
                          <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View full contribution dialog */}
      <Dialog open={!!viewItem} onClose={() => setViewItem(null)} maxWidth="sm" fullWidth>
        {viewItem && (
          <>
            <DialogTitle fontWeight={700}>{viewItem.title}</DialogTitle>
            <DialogContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                  {viewItem.author_name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography fontSize="0.82rem" fontWeight={600}>{viewItem.author_name}</Typography>
                  <Typography fontSize="0.72rem" color="text.secondary">{viewItem.author_email}</Typography>
                </Box>
                <Chip label={viewItem.page_title} size="small" variant="outlined" sx={{ ml: 'auto' }} />
              </Box>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', whiteSpace: 'pre-wrap', fontSize: '0.875rem', fontFamily: 'inherit', lineHeight: 1.7 }}
              >
                {viewItem.body}
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewItem(null)}>Close</Button>
              {viewItem.status === 'pending' && !viewItem.deleted_at && (
                <>
                  <Button color="error" onClick={() => handleReview(viewItem.id, 'rejected')}>
                    Reject
                  </Button>
                  <Button variant="contained" color="success" onClick={() => handleReview(viewItem.id, 'approved')}>
                    Approve
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
