"use client";

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Modal, Backdrop, Fade, IconButton,
  Avatar, GridLegacy as Grid, Card, Chip, CircularProgress, Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Download as DownloadIcon, Close as CloseIcon, LinkedIn, Email } from '@mui/icons-material';
import Image from 'next/image';

export interface TeamMemberRow {
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
        bgcolor: isDark ? 'rgba(5,46,22,0.45)' : 'background.paper',
        border: `1px solid ${isDark ? 'rgba(163,230,53,0.1)' : 'rgba(0,0,0,0.08)'}`,
        transition: 'all 0.2s',
        '&:hover': member.image ? {
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow: isDark ? '0 8px 24px -4px rgba(163,230,53,0.15)' : '0 8px 24px -4px rgba(0,0,0,0.12)',
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
          sx={{ width: { xs: 72, sm: 96, md: 110 }, height: { xs: 72, sm: 96, md: 110 } }}
        />
      </Box>
      <Typography fontWeight={700} fontSize={{ xs: '0.8rem', sm: '0.95rem' }} lineHeight={1.3} mb={0.5}>
        {member.name}
      </Typography>
      {member.roll && (
        <Chip label={member.roll} size="small" variant="outlined"
          sx={{ fontSize: '0.65rem', height: 20, mb: 0.75 }} />
      )}
      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 'auto' }}>
        {member.linkedin && (
          <IconButton size="small" href={member.linkedin} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} sx={{ color: '#0077b5', p: 0.5 }}>
            <LinkedIn fontSize="small" />
          </IconButton>
        )}
        {member.email && (
          <IconButton size="small" href={`mailto:${member.email}`}
            onClick={(e) => e.stopPropagation()} sx={{ color: 'text.secondary', p: 0.5 }}>
            <Email fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Card>
  );
}

function MemberSkeleton() {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Skeleton variant="circular" width={110} height={110} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width={120} height={20} />
      <Skeleton variant="text" width={80} height={16} />
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
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/team-members?slug=${slug}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setMembers)
      .finally(() => setLoading(false));
  }, [slug]);

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

      {loading ? (
        <>
          {SUB_ROLE_ORDER.map((role) => (
            <Box key={role} mb={6}>
              <Skeleton variant="text" width={160} height={32} sx={{ mx: 'auto', mb: 3 }} />
              <Grid container spacing={2} justifyContent="center">
                {[1,2,3,4].map((i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}><MemberSkeleton /></Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </>
      ) : (
        <>
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
                    <Grid item xs={6} sm={4} md={3} lg={2} key={m.id}>
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
        </>
      )}

      {/* Image modal */}
      <Modal open={modalOpen} onClose={handleClose} closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 400, style: { backgroundColor: isDark ? 'rgba(3,10,6,0.85)' : 'rgba(0,0,0,0.6)' } } }}>
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: { xs: '80vw', sm: '50vw', md: '35vw' }, maxWidth: 360,
            bgcolor: 'background.paper', boxShadow: 24, p: 2, borderRadius: 3, outline: 'none',
            border: `1px solid ${isDark ? 'rgba(163,230,53,0.2)' : 'rgba(0,0,0,0.12)'}`,
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
