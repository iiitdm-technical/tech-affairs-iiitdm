"use client";

import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app error]', error);
  }, [error]);

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
      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
        Something went wrong
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
        An unexpected error occurred. You can try again, or head back home.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <Button variant="contained" color="primary" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="outlined" href="/">
          Go home
        </Button>
      </Box>
      {error.digest && (
        <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>
          Ref: {error.digest}
        </Typography>
      )}
    </Box>
  );
}
