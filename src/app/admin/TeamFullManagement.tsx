"use client";

import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import TeamManagement from './TeamManagement';
import TeamMembersManagement from './TeamMembersManagement';

export default function TeamFullManagement() {
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="SAC & Faculty" />
        <Tab label="Core Team Members" />
      </Tabs>
      {tab === 0 && <TeamManagement />}
      {tab === 1 && <TeamMembersManagement />}
    </Box>
  );
}
