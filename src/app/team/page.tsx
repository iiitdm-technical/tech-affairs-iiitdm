"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Avatar,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import {
  Instagram,
  LinkedIn,
  YouTube,
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { Tabs, Tab, useMediaQuery } from "@mui/material";
import { useOrgsByCategory } from "@/hooks/useOrgs";

interface TeamRow {
  id: number;
  type: string; // sac | faculty | social | core_team
  name: string;
  position: string;
  image: string;
  email: string;
  linkedin: string;
  url: string;
  path: string;
  sort_order: number;
}

interface Member {
  name: string;
  role?: string;
  position?: string;
  image: string;
  email?: string;
  linkedin?: string;
}

const TeamMemberCard = styled(Card)(({ theme }) => ({
  height: "100%",
  width: 220,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1.5),
  textAlign: "center",
  wordBreak: "break-word",
  cursor: "pointer",
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.paper : "inherit",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    width: 120,
  },
}));

function MemberGrid({
  members,
  handleOpen,
}: {
  members: Member[];
  handleOpen: (image: string) => void;
}) {
  const theme = useTheme();
  if (!members.length)
    return (
      <Typography color="text.secondary" align="center">
        No data available.
      </Typography>
    );
  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      sx={{ maxWidth: "1200px", mx: "auto" }}
    >
      {members.map((member) => (
        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          key={member.name}
          sx={{ display: "flex", justifyContent: "center", minWidth: 0 }}
        >
          <TeamMemberCard onClick={() => handleOpen(member.image)}>
            <Box
              sx={{
                borderRadius: "50%",
                p: "4px",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: "0 0 12px rgba(0,0,0,0.1)",
                mb: { xs: 0.75, sm: 1, md: 1.5 },
              }}
            >
              <Avatar
                src={member.image}
                alt={member.name}
                sx={{ width: { xs: 70, sm: 90, md: 110 }, height: { xs: 70, sm: 90, md: 110 } }}
              />
            </Box>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
                mb: { xs: 0.5, sm: 0.75, md: 0.75 },
                width: "100%",
                textAlign: "center",
                wordBreak: "break-word",
              }}
            >
              {member.name}
            </Typography>
            {(member.role || member.position) && (
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                  mb: { xs: 0.25, sm: 0.25, md: 0.5 },
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {member.role || member.position}
              </Typography>
            )}
          </TeamMemberCard>
        </Grid>
      ))}
    </Grid>
  );
}

export default function Committee() {
  const theme = useTheme();
  const [teamRows, setTeamRows] = useState<TeamRow[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [orgTab, setOrgTab] = useState(0);

  const clubs       = useOrgsByCategory('club');
  const teams       = useOrgsByCategory('team');
  const societies   = useOrgsByCategory('society');
  const communities = useOrgsByCategory('community');
  const tabOptions  = [
    { label: "Clubs",       data: clubs },
    { label: "Teams",       data: teams },
    { label: "Societies",   data: societies },
    { label: "Communities", data: communities },
  ];

  useEffect(() => {
    fetch('/api/team')
      .then((r) => (r.ok ? r.json() : []))
      .then(setTeamRows)
      .finally(() => setLoadingTeam(false));
  }, []);

  const sacMembers: Member[]      = teamRows.filter((r) => r.type === 'sac').map((r) => ({ name: r.name, position: r.position, image: r.image, email: r.email, linkedin: r.linkedin }));
  const facultyMembers: Member[]  = teamRows.filter((r) => r.type === 'faculty').map((r) => ({ name: r.name, role: r.position, image: r.image }));
  const socialLinks               = teamRows.filter((r) => r.type === 'social');
  const coreTeamLinks             = teamRows.filter((r) => r.type === 'core_team');

  const handleOpen = (image: string) => { setSelectedImage(image); setOpen(true); };
  const handleClose = () => { setOpen(false); setSelectedImage(""); };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = selectedImage;
    link.download = selectedImage.split("/").pop() || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const titleStyle = { color: theme.palette.primary.main, fontWeight: "bold", marginBottom: "1rem" };
  const cardStyle = {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "flex-start", p: 1.5, boxShadow: 3,
    transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" },
  };

  if (loadingTeam) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      {/* Our Family Section */}
      <Box sx={{ width: "100%", typography: "body1", mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={titleStyle}>
          Our Family
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={orgTab} onChange={(_, v) => setOrgTab(v)} aria-label="family tabs" centered>
            {tabOptions.map((tab) => <Tab label={tab.label} key={tab.label} />)}
          </Tabs>
        </Box>
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
          <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3 }} justifyContent="center">
            {tabOptions[orgTab].data.map((item) => (
              <Grid item key={item.name} xs={6} sm={4} md={3} lg={2}
                sx={{ display: "flex", justifyContent: "center" }}>
                <Link href={item.link} passHref
                  style={{ textDecoration: "none", width: "100%", display: "flex", justifyContent: "center" }}>
                  <Card sx={{
                    ...cardStyle,
                    width: { xs: "100%", sm: 160 },
                    maxWidth: { xs: 150, sm: 160 },
                    minHeight: { xs: 150, sm: 160 },
                    p: { xs: 1, sm: 1.5 },
                  }}>
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      sx={{ width: { xs: "66%", sm: "70%" }, margin: "auto", objectFit: "contain", pt: { xs: 1.25, sm: 2 }, height: { xs: "62%", sm: "65%" } }}
                    />
                    <CardContent sx={{ display: "flex", alignItems: "center", height: "35%", px: { xs: 0.5, sm: 1 } }}>
                      <Typography variant="body2" align="center"
                        sx={{ width: "100%", fontWeight: "medium", fontSize: { xs: "0.78rem", sm: "0.875rem" }, lineHeight: 1.25 }}>
                        {item.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Faculty Heads */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={titleStyle}>
          Faculty Heads
        </Typography>
        <MemberGrid members={facultyMembers} handleOpen={handleOpen} />
      </Box>

      {/* SAC */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={titleStyle}>
          SAC
        </Typography>
        <MemberGrid members={sacMembers} handleOpen={handleOpen} />
      </Box>

      {/* Core Teams */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={titleStyle}>
          Our Core Teams
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="center">
          {coreTeamLinks.map((team) => (
            <Grid item xs={6} sm={6} md={2} key={team.name}
              sx={{ display: "flex", justifyContent: "center" }}>
              <Card sx={{
                width: { xs: 180, sm: 160 }, height: { xs: 170, sm: 130 },
                minWidth: { xs: 180, sm: 160 }, minHeight: { xs: 170, sm: 130 },
                maxWidth: { xs: 180, sm: 160 }, maxHeight: { xs: 170, sm: 130 },
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "flex-start", p: 1.5, boxShadow: 3,
                transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" },
              }}>
                <Box sx={{ flexGrow: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="h6" align="center"
                    sx={{ fontSize: { xs: "1.1rem", sm: "1rem" }, fontWeight: 700, letterSpacing: 1, color: "primary.main", textShadow: "0 1px 4px rgba(25,118,210,0.15)" }}>
                    {team.name}
                  </Typography>
                </Box>
                <Link
                  className="team-view-btn"
                  style={{ alignSelf: "center", fontSize: "0.9em", padding: "0.5em 1.2em", minWidth: 0,
                    borderRadius: "0.5em", fontWeight: 700, border: "none", cursor: "pointer",
                    marginTop: "0.3em", marginBottom: "0.3em",
                    color: theme.palette.primary.main,
                  }}
                  href={team.path}
                >
                  View Team
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Social Media */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={titleStyle}>
          Connect With Us
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          {socialLinks.map((s) => (
            <IconButton key={s.name} color="primary" href={s.url} target="_blank" rel="noopener noreferrer">
              {s.name === 'Instagram' && <Instagram fontSize="large" />}
              {s.name === 'LinkedIn'  && <LinkedIn  fontSize="large" />}
              {s.name === 'YouTube'   && <YouTube   fontSize="large" />}
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Image modal */}
      <Modal open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500, style: { backgroundColor: "rgba(255,255,255,0.5)" } } }}>
        <Fade in={open}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: { xs: "60vw", sm: "50vw", md: "35vw", lg: "25vw" },
            maxWidth: "300px", maxHeight: "50vh",
            bgcolor: "background.paper", boxShadow: 24, p: 2, borderRadius: 2, outline: "none",
            border: `2px solid ${theme.palette.divider}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconButton aria-label="close" onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8, color: (t) => t.palette.grey[500], zIndex: 1 }}>
              <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              <Box sx={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "4px",
                display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                {selectedImage && (
                  <Image src={selectedImage} alt="Team member" width={300} height={300}
                    style={{ width: "100%", height: "auto", maxHeight: "40vh", objectFit: "contain" }} />
                )}
              </Box>
              <IconButton aria-label="download" onClick={handleDownload}
                sx={{ position: "absolute", top: 16, right: 16, color: "primary.main",
                  backgroundColor: "rgba(255,255,255,0.7)", "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" } }}>
                <DownloadIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
