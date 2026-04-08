"use client";

import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Chip, Button, Typography,
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, Divider, useMediaQuery,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CalendarToday, Inventory2, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';

interface Equipment {
  name: string;
  category: string;
}

interface Booking {
  booking_id: number;
  project_name: string;
  department: string;
  intended_use: string;
  start_time: string;
  end_time: string;
  status: 'P' | 'A' | 'R';
  created_at: string;
  comments: string;
  equipment: Equipment[];
}

const STATUS_CONFIG = {
  P: { label: 'Pending',  color: 'warning' as const, description: 'Awaiting admin approval' },
  A: { label: 'Approved', color: 'success' as const, description: 'Booking confirmed' },
  R: { label: 'Rejected', color: 'error'   as const, description: 'Request not approved' },
};

export default function MyBookings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; bookingId: number | null }>({
    open: false, bookingId: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const fetchBookings = async () => {
    setError(false);
    try {
      const response = await fetch('/i2r/api/bookings');
      if (response.ok) {
        setBookings(await response.json());
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancelBooking = async () => {
    if (!cancelDialog.bookingId) return;
    try {
      const response = await fetch('/i2r/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: cancelDialog.bookingId }),
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Booking cancelled successfully', severity: 'success' });
        fetchBookings();
      } else {
        const err = await response.json();
        setSnackbar({ open: true, message: err.error || 'Failed to cancel booking', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Error cancelling booking', severity: 'error' });
    } finally {
      setCancelDialog({ open: false, bookingId: null });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" flexDirection="column" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading your bookings…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="error" gutterBottom>Failed to load bookings</Typography>
        <Button variant="outlined" onClick={() => { setLoading(true); fetchBookings(); }}>Try Again</Button>
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Inventory2 sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>No bookings yet</Typography>
        <Typography variant="body2" color="text.secondary">
          Submit a new booking request using the "New Booking" tab above.
        </Typography>
      </Box>
    );
  }

  // Sort: pending first, then approved, then rejected; within each by created_at desc
  const sorted = [...bookings].sort((a, b) => {
    const order = { P: 0, A: 1, R: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" fontWeight={700}>My Bookings</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {(['P', 'A', 'R'] as const).map((s) => {
            const count = bookings.filter((b) => b.status === s).length;
            if (!count) return null;
            return (
              <Chip
                key={s}
                label={`${count} ${STATUS_CONFIG[s].label}`}
                color={STATUS_CONFIG[s].color}
                size="small"
                variant="outlined"
              />
            );
          })}
        </Box>
      </Box>

      {/* Mobile: card layout */}
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sorted.map((booking) => {
            const status = STATUS_CONFIG[booking.status];
            return (
              <Card
                key={booking.booking_id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor: booking.status === 'P'
                    ? 'warning.main'
                    : booking.status === 'A'
                    ? 'success.main'
                    : 'divider',
                  borderLeftWidth: 4,
                }}
              >
                <CardContent sx={{ pb: '12px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography fontWeight={700} fontSize="0.95rem" gutterBottom={false}>
                        {booking.project_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{booking.department}</Typography>
                    </Box>
                    <Chip label={status.label} color={status.color} size="small" />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 15, color: 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography variant="body2" fontSize="0.8rem">
                        {format(new Date(booking.start_time), 'MMM d, yyyy · HH:mm')}
                      </Typography>
                      <Typography variant="body2" fontSize="0.8rem" color="text.secondary">
                        → {format(new Date(booking.end_time), 'MMM d, yyyy · HH:mm')}
                      </Typography>
                    </Box>
                  </Box>

                  {booking.equipment.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      <Inventory2 sx={{ fontSize: 15, color: 'text.secondary', mt: 0.25 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {booking.equipment.map((eq, i) => (
                          <Chip key={i} label={eq.name} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {booking.comments && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                      Note: {booking.comments}
                    </Typography>
                  )}

                  {booking.status === 'P' && (
                    <Box sx={{ mt: 1.5 }}>
                      <Button
                        variant="outlined" color="error" size="small" fullWidth
                        startIcon={<Cancel fontSize="small" />}
                        onClick={() => setCancelDialog({ open: true, bookingId: booking.booking_id })}
                      >
                        Cancel Request
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        /* Desktop: table layout */
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Project / Department</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Equipment</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Time Window</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Notes</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((booking) => {
                const status = STATUS_CONFIG[booking.status];
                return (
                  <TableRow key={booking.booking_id} hover>
                    <TableCell sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>#{booking.booking_id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{booking.project_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{booking.department}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {booking.equipment.map((eq, i) => (
                          <Chip key={i} label={eq.name} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontSize="0.8rem">
                        {format(new Date(booking.start_time), 'MMM d, HH:mm')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        → {format(new Date(booking.end_time), 'MMM d, HH:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip label={status.label} color={status.color} size="small" />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontSize: '0.68rem' }}>
                          {status.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: booking.comments ? 'italic' : 'normal' }}>
                        {booking.comments || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {booking.status === 'P' && (
                        <Button
                          variant="outlined" color="error" size="small"
                          onClick={() => setCancelDialog({ open: true, bookingId: booking.booking_id })}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, bookingId: null })}>
        <DialogTitle>Cancel Booking Request</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this booking request? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, bookingId: null })}>Keep It</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">Yes, Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
