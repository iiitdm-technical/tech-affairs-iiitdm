import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { I2RProvider } from "./I2RProvider";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default async function I2RLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await getCurrentSession();

  // Not logged in — show a clear gate instead of a silent redirect
  if (!session || !user) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}>
        <Box sx={{
          textAlign: 'center',
          maxWidth: 420,
        }}>
          {/* PCB-style icon */}
          <Box sx={{
            width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 3,
            background: 'linear-gradient(135deg, #16a34a, #a3e635)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(163,230,53,0.35)',
          }}>
            <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#030a06', lineHeight: 1 }}>
              I²R
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight={800} letterSpacing="-0.03em" gutterBottom>
            I²R Makerspace
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1, lineHeight: 1.75 }}>
            Book lab equipment, track your requests, and bring your ideas to life.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, opacity: 0.7 }}>
            Sign in with your <strong>@iiitdm.ac.in</strong> account to continue.
          </Typography>

          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            sx={{
              px: 5, py: 1.4, borderRadius: 3, fontWeight: 700,
              background: 'linear-gradient(135deg, #16a34a, #a3e635)',
              color: '#030a06',
              boxShadow: '0 4px 20px -4px rgba(163,230,53,0.5)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d, #84cc16)',
                boxShadow: '0 8px 30px -4px rgba(163,230,53,0.6)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Sign in to access I²R
          </Button>
        </Box>
      </Box>
    );
  }

  // All logged-in IIITDM users can access i2r (U = student, O = org admin, A = super admin)
  if (!['U', 'O', 'A'].includes(user.role)) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permission to access the I2R Lab Booking System.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <I2RProvider user={user}>
      <Box sx={{ my: 16, minHeight: '100vh' }}>
        {children}
      </Box>
    </I2RProvider>
  );
}
