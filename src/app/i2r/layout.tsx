import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { I2RProvider } from "./I2RProvider";
import { Box, Typography } from "@mui/material";

export default async function I2RLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await getCurrentSession();

  // If no user, redirect to login
  if (!session || !user) {
    redirect("/login/google");
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
