"use client";

import Link from "next/link";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { GiMolecule } from "react-icons/gi";
import { SiOctave, SiPython, SiR } from "react-icons/si";
import { TbAtom, TbBuildingBridge, TbChartHistogram } from "react-icons/tb";
import { getFrostCategory } from "@/lib/data/frost";

const category = getFrostCategory("scientific");
const icons = { matlab: <SiOctave size={32} />, ansys: <TbBuildingBridge size={32} />, comsol: <TbAtom size={32} />, abaqus: <TbChartHistogram size={32} />, python: <SiPython size={32} />, r: <SiR size={32} />, materials: <GiMolecule size={32} /> };

export default function ScientificPage() {
  const isDark = useTheme().palette.mode === "dark";
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 10, md: 14 } }}><Container maxWidth="lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Button component={Link} href="/frost" startIcon={<ArrowBack />} size="small" sx={{ mb: 4, color: "text.secondary" }}>Back to FROST</Button>
        <Typography variant="h3" fontWeight={900} letterSpacing="-0.04em" mb={1.5} sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>{category.pageTitle}</Typography>
        <Typography color="text.secondary" mb={6} maxWidth={580} lineHeight={1.75}>{category.pageDescription}</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }, gap: 2.5 }}>
          {category.items.map((item, index) => <motion.div key={item.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.07 }}>
            <Card component={Link} href={`/frost/scientific/${item.slug}`} sx={{ height: "100%", textDecoration: "none", bgcolor: isDark ? "rgba(16,37,74,0.45)" : "background.paper", border: `1px solid ${isDark ? "rgba(125,211,252,0.1)" : "rgba(0,0,0,0.08)"}`, borderRadius: 3, transition: "all 0.22s", "&:hover": { borderColor: item.color, transform: "translateY(-3px)" } }}>
              <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}><Box sx={{ color: item.color, mb: 1.5 }}>{icons[item.icon as keyof typeof icons]}</Box><Chip label={item.tag} size="small" sx={{ alignSelf: "flex-start", mb: 1.25, fontSize: "0.65rem", height: 20, bgcolor: `${item.color}14`, color: item.color }} /><Typography fontWeight={700} mb={0.75}>{item.title}</Typography><Typography color="text.secondary" fontSize="0.78rem" lineHeight={1.65} mb={2} flexGrow={1}>{item.description}</Typography><Box display="flex" alignItems="center" gap={0.5} sx={{ color: item.color, fontWeight: 600, fontSize: "0.78rem" }}>Download guide <ArrowForward sx={{ fontSize: 13 }} /></Box></CardContent>
            </Card>
          </motion.div>)}
        </Box>
      </motion.div>
    </Container></Box>
  );
}
