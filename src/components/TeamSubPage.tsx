"use client";

import React, { useState } from 'react';
import {
  Container, Typography, Box, Modal, Backdrop, Fade, IconButton,
  Avatar, Grid, Card,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download as DownloadIcon, Close as CloseIcon, LinkedIn, Email } from '@mui/icons-material';
import Image from 'next/image';
import { teamMembersData } from '@/data/team-members';

export interface TeamMemberRow {
  id?: number;
  team_slug: string;
  sub_role: string;
  name: string;
  roll: string;
  email: string;
  linkedin: string;
  image: string;
  sort_order: number;
  active?: string;
}

const SUB_ROLE_LABELS: Record<string, string> = {
  core: 'Cores',
  'jt-core': 'Joint Cores',
  coordinator: 'Coordinators',
};

const SUB_ROLE_ORDER = ['core', 'jt-core', 'coordinator'];

function MemberCard({
  member, onImageClick,
}: { member: TeamMemberRow; onImageClick: (img: string) => void }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card
      onClick={() => member.image && onImageClick(member.image)}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        p: { xs: 1.5, sm: 2 }, textAlign: 'center', cursor: member.image ? 'pointer' : 'default',
        bgcolor: isDark ? 'rgba(16,37,74,0.45)' : 'background.paper',
        border: `1px solid ${isDark ? 'rgba(125,211,252,0.1)' : 'rgba(0,0,0,0.08)'}`,
        transition: 'all 0.2s',
        '&:hover': member.image ? {
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow: isDark ? '0 8px 24px -4px rgba(125,211,252,0.15)' : '0 8px 24px -4px rgba(0,0,0,0.12)',
        } : {},
      }}
    >
      <Box sx={{
        borderRadius: '50%', p: '3px', mb: { xs: 1, sm: 1.5 },
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      }}>
        <Avatar
          src={member.image}
          alt={member.name}
          sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }}
        />
      </Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
        {member.name}
      </Typography>
      {member.roll && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          {member.roll}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 0.5, mt: 'auto', pt: 1 }}>
        {member.email && (
          <IconButton size="small" href={`mailto:${member.email}`} sx={{ color: 'text.secondary' }}>
            <Email fontSize="small" />
          </IconButton>
        )}
        {member.linkedin && (
          <IconButton size="small" href={member.linkedin} target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary' }}>
            <LinkedIn fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Card>
  );
}

interface TeamSubPageProps {
  slug: string;
  title: string;
  description: string;
}

export default function TeamSubPage({ slug, title, description }: TeamSubPageProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selectedImage, setSelectedImage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Directly filter the hardcoded static team data
  const members = teamMembersData.filter((m) => m.team_slug === slug);

  const handleClose = () => { setModalOpen(false); setSelectedImage(''); };

  // Group by sub_role
  const grouped = SUB_ROLE_ORDER.reduce((acc, role) => {
    acc[role] = members.filter((m) => m.sub_role === role);
    return acc;
  }, {} as Record<string, TeamMemberRow[]>);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 10, md: 12 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" fontWeight={900} letterSpacing="-0.04em"
          sx={{
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', mb: 2,
          }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', lineHeight: 1.75 }}>
          {description}
        </Typography>
      </Box>

      {SUB_ROLE_ORDER.map((role) => {
        const group = grouped[role];
        if (!group || group.length === 0) return null;
        return (
          <Box key={role} mb={6}>
            <Typography variant="h5" align="center" fontWeight={800} letterSpacing="-0.02em"
              sx={{
                mb: 3, color: theme.palette.primary.main,
                fontSize: { xs: '1.3rem', sm: '1.6rem' },
                position: 'relative',
                '&::after': {
                  content: '""', display: 'block', width: 48, height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 2, mx: 'auto', mt: 1,
                }
              }}>
              {SUB_ROLE_LABELS[role] || role}
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} justifyContent="center">
              {group.map((m) => (
                <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={m.roll || m.name}>
                  <MemberCard member={m} onImageClick={(img) => { setSelectedImage(img); setModalOpen(true); }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}

      {members.length === 0 && (
        <Typography color="text.secondary" align="center" py={8}>
          No members found.
        </Typography>
      )}

      {/* Image modal */}
      <Modal open={modalOpen} onClose={handleClose} closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 400, style: { backgroundColor: isDark ? 'rgba(7,11,24,0.85)' : 'rgba(0,0,0,0.6)' } } }}>
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: { xs: '80vw', sm: '50vw', md: '35vw' }, maxWidth: 360,
            bgcolor: 'background.paper', boxShadow: 24, p: 2, borderRadius: 3, outline: 'none',
            border: `1px solid ${isDark ? 'rgba(125,211,252,0.2)' : 'rgba(0,0,0,0.12)'}`,
          }}>
            <IconButton onClick={handleClose}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
            {selectedImage && (
              <Image src={selectedImage} alt="Member" width={340} height={340}
                style={{ width: '100%', height: 'auto', borderRadius: 8, objectFit: 'contain' }} />
            )}
            <IconButton
              href={selectedImage}
              download
              sx={{ display: 'flex', mx: 'auto', mt: 1, color: 'primary.main' }}
            >
              <DownloadIcon />
            </IconButton>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
