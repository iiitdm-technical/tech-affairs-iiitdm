
"use client"

import React from 'react';
import { Box } from '@mui/material';

import Hero from '../components/Hero';
import About from '../components/About';
import Achievements from '../components/Achievements';
import Highlights from '../components/Highlights';
import SponsorsSection from '../components/SponsorsSection';
import Techfest from '../components/Techfest';
import AnnouncementsPopup from '../components/AnnouncementsPopup';

function Home() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AnnouncementsPopup />
      <Hero />
      <About />
      <Achievements />
      <Highlights />
      <SponsorsSection />
      <Techfest />
    </Box>
  );
}

export default Home;
