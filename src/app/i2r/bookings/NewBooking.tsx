"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Box, TextField, Button, Typography, FormControl, InputLabel,
  Select, MenuItem, OutlinedInput, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, GridLegacy as Grid, Tooltip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SelectChangeEvent } from '@mui/material/Select';

interface Equipment {
  equipment_id: number;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  status: string;
}

interface NewBookingProps {
  onBookingCreated: () => void;
}

export default function NewBooking({ onBookingCreated }: NewBookingProps) {
  const [formData, setFormData] = useState({
    department: '',
    project_name: '',
    intended_use: '',
    start_time: null as Date | null,
    end_time: null as Date | null,
    equipment_ids: [] as number[],
  });

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookedIds, setBookedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState(true);
  const [successDialog, setSuccessDialog] = useState<{ open: boolean; bookingId: number | null }>({
    open: false, bookingId: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  useEffect(() => {
    fetch('/i2r/api/equipment')
      .then((r) => (r.ok ? r.json() : []))
      .then(setEquipment)
      .catch(() =>
        setSnackbar({ open: true, message: 'Failed to load equipment', severity: 'error' })
      )
      .finally(() => setEquipmentLoading(false));
  }, []);

  // Re-check availability whenever time window changes
  const checkAvailability = useCallback(
    async (start: Date | null, end: Date | null) => {
      if (!start || !end || end <= start) { setBookedIds([]); return; }
      try {
        const res = await fetch(
          `/i2r/api/availability?start=${start.toISOString()}&end=${end.toISOString()}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookedIds(data.booked_equipment_ids ?? []);
          // Remove any selected equipment that just became unavailable
          setFormData((prev) => ({
            ...prev,
            equipment_ids: prev.equipment_ids.filter((id) => !data.booked_equipment_ids.includes(id)),
          }));
        }
      } catch {
        // silently ignore availability check errors
      }
    },
    []
  );

  const handleTimeChange = (field: 'start_time' | 'end_time', value: Date | null) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      checkAvailability(
        field === 'start_time' ? value : prev.start_time,
        field === 'end_time' ? value : prev.end_time
      );
      return updated;
    });
  };

  const handleEquipmentChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, equipment_ids: typeof value === 'string' ? [] : value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { department, project_name, intended_use, start_time, end_time, equipment_ids } = formData;

    if (!department || !project_name || !intended_use || !start_time || !end_time || equipment_ids.length === 0) {
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      return;
    }
    if (start_time >= end_time) {
      setSnackbar({ open: true, message: 'End time must be after start time', severity: 'error' });
      return;
    }
    if (start_time < new Date()) {
      setSnackbar({ open: true, message: 'Start time cannot be in the past', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/i2r/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          start_time: start_time.toISOString(),
          end_time: end_time.toISOString(),
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setSuccessDialog({ open: true, bookingId: result.booking_id });
        setFormData({ department: '', project_name: '', intended_use: '', start_time: null, end_time: null, equipment_ids: [] });
        setBookedIds([]);
      } else {
        const err = await res.json();
        setSnackbar({ open: true, message: err.error || 'Failed to create booking', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Error creating booking', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (equipmentLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading equipment…</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h6" gutterBottom>New Booking Request</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth required label="Department" value={formData.department}
              onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth required label="Project Name" value={formData.project_name}
              onChange={(e) => setFormData((p) => ({ ...p, project_name: e.target.value }))} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth required multiline rows={3} label="Intended Use" value={formData.intended_use}
              onChange={(e) => setFormData((p) => ({ ...p, intended_use: e.target.value }))} />
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Start Time"
              value={formData.start_time}
              onChange={(v) => handleTimeChange('start_time', v)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="End Time"
              value={formData.end_time}
              onChange={(v) => handleTimeChange('end_time', v)}
              minDateTime={formData.start_time ?? undefined}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Equipment</InputLabel>
              <Select
                multiple
                value={formData.equipment_ids}
                onChange={handleEquipmentChange}
                input={<OutlinedInput label="Equipment" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const eq = equipment.find((e) => e.equipment_id === id);
                      return (
                        <Chip key={id} label={eq ? `${eq.name} (${eq.category})` : `#${id}`} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {equipment.map((eq) => {
                  const isBooked = bookedIds.includes(eq.equipment_id);
                  return (
                    <MenuItem
                      key={eq.equipment_id}
                      value={eq.equipment_id}
                      disabled={isBooked}
                    >
                      <Tooltip title={isBooked ? 'Already booked for this time slot' : ''} placement="right">
                        <Box width="100%">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1">{eq.name}</Typography>
                            {isBooked && <Chip label="Booked" size="small" color="warning" />}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {eq.category} — {eq.description}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {bookedIds.length > 0 && formData.start_time && formData.end_time && (
              <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                {bookedIds.length} item{bookedIds.length > 1 ? 's' : ''} unavailable for the selected time window.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button type="button" variant="outlined"
                onClick={() => { setFormData({ department: '', project_name: '', intended_use: '', start_time: null, end_time: null, equipment_ids: [] }); setBookedIds([]); }}>
                Reset
              </Button>
              <Button type="submit" variant="contained" disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}>
                {loading ? 'Submitting…' : 'Submit Booking Request'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={successDialog.open} onClose={() => { setSuccessDialog({ open: false, bookingId: null }); onBookingCreated(); }}>
        <DialogTitle>Booking Request Submitted</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Your booking request has been successfully submitted!</Typography>
          <Typography variant="body2" color="text.secondary">Booking ID: {successDialog.bookingId}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your request is pending admin approval. You'll be notified once it's reviewed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSuccessDialog({ open: false, bookingId: null }); onBookingCreated(); }} variant="contained">
            View My Bookings
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}
