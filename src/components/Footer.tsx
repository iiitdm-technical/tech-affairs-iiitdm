"use client"

import React from "react";
import {
  Box,
  Container,
  GridLegacy as Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import DownloadIcon from "@mui/icons-material/Download";

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const downloads = [
    {
      name: "Tech Event Advance/Reimbursement",
      href: "/downloads/Tech_Event_Advance_Reimbursement_Form.pdf",
    },
    {
      name: "Tech Event Approval Form",
      href: "/downloads/Tech_Event_Approval_Form.pdf",
    },
    {
      name: "Club On-Campus Event Approval",
      href: "/downloads/Technical_Club–On_Campus_Event_Approval.pdf",
    },
   
  ];

  const socialLinks = [
    {
      icon: <LinkedInIcon />,
      href: "https://www.linkedin.com/company/technical-affairs-iiitdm/",
      color: '#38bdf8',
    },
    {
      icon: <InstagramIcon />,
      href: "https://www.instagram.com/iiitdm.technical/",
      color: '#f472b6',
    },
    {
      icon: <YouTubeIcon />,
      href: "https://www.youtube.com/@iiitdm.technical",
      color: '#fb7185',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        pt: 8,
        pb: 4,
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.14)'}`,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 720,
                    mb: 2,
                    color: "text.primary",
                    letterSpacing: '-0.01em',
                  }}
                >
                  Contact Us
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: "none",
                    p: 0,
                    m: 0,
                  }}
                >
                  <Box
                    component="li"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <EmailIcon sx={{ color: '#fb923c', fontSize: '1.2rem', mt: 0.3 }} />
                    <Typography variant="body2" color="text.secondary">
                      technical.affairs@iiitdm.ac.in
                    </Typography>
                  </Box>
                  <Box
                    component="li"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <PhoneIcon sx={{ color: '#34d399', fontSize: '1.2rem', mt: 0.3 }} />
                    <Typography variant="body2" color="text.secondary">
                      +91 44 2747 6335
                    </Typography>
                  </Box>
                  <Box
                    component="li"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <LocationOnIcon sx={{ color: '#f472b6', fontSize: '1.2rem', mt: 0.3 }} />
                    <Typography variant="body2" color="text.secondary">
                      IIITDM Kancheepuram,
                      <br />
                      Vandalur-Kelambakkam Road,
                      <br />
                      Chennai - 600 127,
                      <br />
                      Tamil Nadu, India
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 720,
                    mb: 2,
                    color: "text.primary",
                    letterSpacing: '-0.01em',
                  }}
                >
                  Connect With Us
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "text.secondary",
                        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'}`,
                        borderRadius: 2.5,
                        transition: 'all 0.2s ease',
                        "&:hover": {
                          color: social.color,
                          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.65 }}
                >
                  Follow us on social media to stay updated with our latest
                  events, achievements, and opportunities.
                </Typography>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 720,
                    mb: 2,
                    color: "text.primary",
                    letterSpacing: '-0.01em',
                  }}
                >
                  Downloads
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: "none",
                    p: 0,
                    m: 0,
                  }}
                >
                  {downloads.map((download) => (
                    <Box
                      component="li"
                      key={download.name}
                      sx={{
                        mb: 1,
                      }}
                    >
                      <Link
                        href={download.href}
                        download={!download.href.startsWith('http')}
                        target={download.href.startsWith('http') ? "_blank" : undefined}
                        rel={download.href.startsWith('http') ? "noopener noreferrer" : undefined}
                        color="text.secondary"
                        sx={{
                          textDecoration: "none",
                          transition: 'color 0.2s ease',
                          "&:hover": {
                            color: "#fb923c",
                          },
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        <DownloadIcon sx={{ color: '#fb923c', fontSize: '1rem' }} />
                        {download.name}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.14)' }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                mb: { xs: 2, sm: 0 },
                fontSize: '0.72rem',
                color: isDark ? 'rgba(241,240,245,0.28)' : 'rgba(15,23,42,0.46)',
              }}
            >
              &copy; 2025 Technical Affairs, IIITDM Kancheepuram. All rights
              reserved.
            </Typography>
            <Box>
              <Link
                href="#"
                sx={{
                  textDecoration: "none",
                  color: isDark ? 'rgba(241,240,245,0.28)' : 'rgba(15,23,42,0.46)',
                  fontSize: '0.72rem',
                  transition: 'color 0.2s ease',
                  "&:hover": { color: "#fb923c" },
                  mr: 2,
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  textDecoration: "none",
                  color: isDark ? 'rgba(241,240,245,0.28)' : 'rgba(15,23,42,0.46)',
                  fontSize: '0.72rem',
                  transition: 'color 0.2s ease',
                  "&:hover": { color: "#fb923c" },
                }}
              >
                Terms of Use
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
