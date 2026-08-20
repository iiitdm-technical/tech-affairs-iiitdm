"use client";

import Link from "next/link";
import { Apps, ArrowBack, ArrowForward, Groups, Window } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { SiAdobecreativecloud } from "react-icons/si";
import { getFrostCategory } from "@/lib/data/frost";

const category = getFrostCategory("windows");
const icons = { apps: <Apps sx={{ fontSize: 36 }} />, windows: <Window sx={{ fontSize: 36 }} />, teams: <Groups sx={{ fontSize: 36 }} />, adobe: <SiAdobecreativecloud size={36} /> };

export default function WindowsPage() {
  const isDark = useTheme().palette.mode === "dark";
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 10, md: 14 } }}><Container maxWidth="lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Button component={Link} href="/frost" startIcon={<ArrowBack />} size="small" sx={{ mb: 4, color: "text.secondary" }}>Back to FROST</Button>
        <Typography variant="h3" fontWeight={900} letterSpacing="-0.04em" mb={1.5} sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>{category.pageTitle}</Typography>
        <Typography color="text.secondary" mb={6} maxWidth={560} lineHeight={1.75}>{category.pageDescription}</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2.5 }}>
          {category.items.map((item, index) => <motion.div key={item.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }}>
            <Card component={Link} href={`/frost/windows/${item.slug}`} sx={{ height: "100%", textDecoration: "none", bgcolor: isDark ? "rgba(16,37,74,0.45)" : "background.paper", border: `1px solid ${isDark ? "rgba(125,211,252,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 3, transition: "all 0.22s", "&:hover": { borderColor: item.color, transform: "translateY(-3px)" } }}>
              <CardContent sx={{ p: 2.5 }}><Box sx={{ color: item.color, mb: 2 }}>{icons[item.icon as keyof typeof icons]}</Box><Typography fontWeight={700} mb={0.75}>{item.title}</Typography><Typography color="text.secondary" fontSize="0.8rem" lineHeight={1.6} mb={2}>{item.description}</Typography><Box display="flex" alignItems="center" gap={0.5} sx={{ color: item.color, fontWeight: 600, fontSize: "0.8rem" }}>Learn more <ArrowForward sx={{ fontSize: 14 }} /></Box></CardContent>
            </Card>
          </motion.div>)}
        </Box>
      </motion.div>
    </Container></Box>
  );
}
