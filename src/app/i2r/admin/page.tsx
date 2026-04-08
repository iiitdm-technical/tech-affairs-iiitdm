"use client";

import { useState, useEffect } from 'react';
import { useI2R } from '../I2RProvider';
import {
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import EquipmentManagement from './EquipmentManagement';
import PendingRequests from './PendingRequests';
import CompletedBookings from './CompletedBookings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`admin-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const { user } = useI2R();
  const [tabValue, setTabValue] = useState(0);

  // Auto-release expired approved bookings on admin dashboard load
  useEffect(() => {
    if (user.role === 'A') {
      fetch('/i2r/api/admin/release', { method: 'POST' }).catch(() => {});
    }
  }, [user.role]);

  if (user.role !== 'A') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>Access Denied</Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have admin privileges to access this page.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} aria-label="admin tabs">
            <Tab label="Equipment" />
            <Tab label="Pending Requests" />
            <Tab label="All Bookings" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <EquipmentManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <PendingRequests />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <CompletedBookings />
        </TabPanel>
      </Paper>
    </Container>
  );
}
