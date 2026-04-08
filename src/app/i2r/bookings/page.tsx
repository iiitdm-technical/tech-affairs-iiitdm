"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Box, Tabs, Tab, Paper } from '@mui/material';
import MyBookings from './MyBookings';
import NewBooking from './NewBooking';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`bookings-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function BookingsContent() {
  const searchParams = useSearchParams();
  const [tabValue, setTabValue] = useState(searchParams.get('tab') === 'new' ? 1 : 0);

  useEffect(() => {
    if (searchParams.get('tab') === 'new') setTabValue(1);
  }, [searchParams]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} aria-label="bookings tabs">
            <Tab label="My Bookings" />
            <Tab label="New Booking" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <MyBookings />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <NewBooking onBookingCreated={() => setTabValue(0)} />
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsContent />
    </Suspense>
  );
}
