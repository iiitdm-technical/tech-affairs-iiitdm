"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 10 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

function LoginContent() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    non_iiitdm: "Only @iiitdm.ac.in email addresses are allowed.",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(21,128,61,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-8%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)"}`,
          backdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "0 32px 64px rgba(0,0,0,0.4)"
            : "0 32px 64px rgba(15,23,42,0.12)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo + wordmark */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Box sx={{ position: "relative", width: 64, height: 64, mb: 2 }}>
            <Image
              src={isDark ? "/nav_logo.webp" : "/nav_logo_inv.webp"}
              alt="Technical Affairs Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: "-0.03em", color: "text.primary", mb: 0.5 }}
          >
            Technical Affairs
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.82rem", letterSpacing: "0.04em" }}
          >
            IIITDM Kancheepuram
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 0.75, color: "text.primary", fontSize: "1.05rem" }}
        >
          Sign in to continue
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
          Use your <strong>@iiitdm.ac.in</strong> Google account. Club &amp; team admins will be
          redirected to their dashboard automatically.
        </Typography>

        {error && (
          <Box
            sx={{
              mb: 2.5,
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#ef4444", fontSize: "0.85rem" }}>
              {errorMessages[error] ?? "Something went wrong. Please try again."}
            </Typography>
          </Box>
        )}

        <Button
          component="a"
          href="/login/google"
          fullWidth
          variant="outlined"
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            fontWeight: 650,
            fontSize: "0.95rem",
            textTransform: "none",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.2)"}`,
            color: "text.primary",
            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            "&:hover": {
              bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.03)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.25)" : "rgba(15,23,42,0.35)"}`,
            },
          }}
        >
          <GoogleIcon />
          Sign in with Google
        </Button>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 3,
            color: "text.disabled",
            lineHeight: 1.5,
          }}
        >
          Access is restricted to @iiitdm.ac.in accounts only.
        </Typography>
      </Paper>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
