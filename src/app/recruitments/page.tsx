"use client";

import React from "react";
import { Box, Container, Typography, alpha } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";

import GroupsIcon from "@mui/icons-material/Groups";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PublicIcon from "@mui/icons-material/Public";
import { recruitments } from "@/lib/data/content";

const sectionIcons = {
  clubs: <GroupsIcon sx={{ fontSize: 36 }} />,
  teams: <PrecisionManufacturingIcon sx={{ fontSize: 36 }} />,
  communities: <PublicIcon sx={{ fontSize: 36 }} />,
  societies: <AccountBalanceIcon sx={{ fontSize: 36 }} />,
};

export default function RecruitmentsPage() {
  const { isDarkMode } = useThemeContext();

  return (
    <Box
      className={isDarkMode ? "grids-dark" : "grids-light"}
      sx={{
        minHeight: "100vh",
        pt: { xs: 14, md: 18 },
        pb: 10,
      }}
    >
      <Container maxWidth="md">

        {/* HEADER */}

        <Box sx={{ textAlign: "center", mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: "2.6rem", md: "4rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              Recruitments
              <br />
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg,#fb923c,#f472b6,#a78bfa,#38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {recruitments.year}
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 650,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.2rem" },
                color: "text.secondary",
              }}
            >
              {recruitments.intro}
            </Typography>
          </motion.div>
        </Box>

        {/* GRID */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 4,
          }}
        >
          {recruitments.sections.map((section) => (
            <motion.div key={section.title} whileHover={{ y: -6 }}>
              <Link href={section.link} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    height: 260,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",

                    bgcolor: isDarkMode
                      ? alpha("#ffffff", 0.03)
                      : alpha("#ffffff", 0.7),

                    backdropFilter: "blur(18px)",

                    borderRadius: 6,

                    border: "1px solid",
                    borderColor: isDarkMode
                      ? alpha("#ffffff", 0.08)
                      : alpha("#000000", 0.06),

                    position: "relative",
                    overflow: "hidden",

                    transition: "all 0.3s ease",

                    "&:hover": {
                      borderColor: alpha(section.color, 0.45),
                      bgcolor: isDarkMode
                        ? alpha(section.color, 0.05)
                        : alpha(section.color, 0.03),
                    },
                  }}
                >
                  {/* ICON */}

                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(section.color, 0.15),
                      color: section.color,
                    }}
                  >
                    {sectionIcons[section.slug as keyof typeof sectionIcons]}
                  </Box>

                  {/* TITLE */}

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.6rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {section.title}
                  </Typography>

                  {/* DESCRIPTION */}

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {section.description}
                  </Typography>

                </Box>
              </Link>
            </motion.div>
          ))}
        </Box>

      </Container>
    </Box>
  );
}
