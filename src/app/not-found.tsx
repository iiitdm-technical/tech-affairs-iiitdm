import { Box, Button, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 800 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Page not found
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" href="/" sx={{ mt: 1 }}>
        Back to home
      </Button>
    </Box>
  );
}
