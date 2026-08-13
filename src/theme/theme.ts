import { createTheme } from '@mui/material/styles';

const fontFamily = "var(--font-bricolage), var(--font-roboto), 'Roboto', system-ui, sans-serif";

// ── Institute blue / PCB palette ─────────────────────────────────────────────
// Primary   : Sky blue           #7dd3fc   (dark-mode trace highlight)
// Secondary : Amber / gold       #f59e0b   (component labels / warm accent)
// Dark bg   : Near-black blue    #070b18   (board substrate)
// Mid tone  : Deep navy          #10254a   (ground plane)
// Light bg  : Cool off-white     #f6f8fc   (bare board reveal)
// Light UI  : Institute blues    #334984 / #1f82b1

const blue   = '#7dd3fc';
const amber  = '#f59e0b';

const typography = {
  fontFamily,
  h1: { fontWeight: 800, fontFamily, letterSpacing: '-0.045em' },
  h2: { fontWeight: 800, fontFamily, letterSpacing: '-0.04em'  },
  h3: { fontWeight: 750, fontFamily, letterSpacing: '-0.025em' },
  h4: { fontWeight: 720, fontFamily, letterSpacing: '-0.02em'  },
  h5: { fontWeight: 650, fontFamily, letterSpacing: '-0.015em' },
  h6: { fontWeight: 700, fontFamily, letterSpacing: '-0.01em'  },
  body1:     { fontFamily, lineHeight: 1.75 },
  body2:     { fontFamily, lineHeight: 1.65 },
  subtitle1: { fontFamily, fontWeight: 550 },
  subtitle2: { fontFamily, fontWeight: 550 },
  button:    { fontFamily, fontWeight: 650, letterSpacing: '-0.01em' },
};

const components = (mode: 'light' | 'dark') => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*':          { boxSizing: 'border-box' },
      'html, body': { scrollBehavior: 'smooth' },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none' as const,
        fontWeight: 650,
        fontFamily,
        padding: '10px 22px',
        transition: 'all 0.22s cubic-bezier(.22,.61,.36,1)',
      },
      contained: mode === 'dark' ? {
        background: `linear-gradient(135deg, #1f82b1, ${blue})`,
        color: '#070b18',
        boxShadow: `0 4px 20px -4px rgba(125,211,252,0.45)`,
        '&:hover': {
          background: `linear-gradient(135deg, #1f82b1, #38bdf8)`,
          boxShadow: `0 8px 32px -4px rgba(125,211,252,0.55)`,
          transform: 'translateY(-1px)',
        },
      } : {
        background: `linear-gradient(135deg, #334984, #1f82b1)`,
        color: '#eff6ff',
        boxShadow: `0 4px 20px -4px rgba(51,73,132,0.45)`,
        '&:hover': {
          background: `linear-gradient(135deg, #283b70, #334984)`,
          boxShadow: `0 8px 32px -4px rgba(51,73,132,0.55)`,
          transform: 'translateY(-1px)',
        },
      },
      outlined: {
        borderColor: mode === 'dark' ? 'rgba(125,211,252,0.3)' : 'rgba(51,73,132,0.35)',
        color: mode === 'dark' ? blue : '#334984',
        '&:hover': {
          borderColor: mode === 'dark' ? blue : '#1f82b1',
          background: mode === 'dark' ? 'rgba(125,211,252,0.07)' : 'rgba(51,73,132,0.07)',
          transform: 'translateY(-1px)',
        },
      },
      text: {
        color: mode === 'dark' ? blue : '#334984',
        '&:hover': {
          background: mode === 'dark' ? 'rgba(125,211,252,0.08)' : 'rgba(51,73,132,0.07)',
        },
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: { boxShadow: 'none', fontFamily },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: mode === 'dark'
          ? '1px solid rgba(125,211,252,0.1)'
          : '1px solid rgba(51,73,132,0.15)',
        boxShadow: 'none',
        background: mode === 'dark'
          ? 'rgba(16,37,74,0.55)'
          : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.3s cubic-bezier(.22,.61,.36,1), box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.01)',
          borderColor: mode === 'dark' ? 'rgba(125,211,252,0.35)' : 'rgba(51,73,132,0.4)',
          boxShadow: mode === 'dark'
            ? '0 20px 48px -12px rgba(125,211,252,0.2), 0 0 0 1px rgba(125,211,252,0.12)'
            : '0 20px 48px -12px rgba(51,73,132,0.18)',
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        background: mode === 'dark' ? 'rgba(9,19,38,0.88)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        border: mode === 'dark'
          ? '1px solid rgba(125,211,252,0.1)'
          : '1px solid rgba(51,73,132,0.12)',
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily,
        fontWeight: 600,
        textTransform: 'none' as const,
        letterSpacing: '-0.01em',
        '&.Mui-selected': { color: mode === 'dark' ? blue : '#334984' },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: { fontFamily, fontWeight: 600, borderRadius: 6 },
      colorPrimary: {
        background: mode === 'dark' ? 'rgba(125,211,252,0.12)' : 'rgba(51,73,132,0.1)',
        color: mode === 'dark' ? blue : '#334984',
        border: mode === 'dark' ? '1px solid rgba(125,211,252,0.25)' : '1px solid rgba(51,73,132,0.25)',
      },
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root: {
        fontFamily,
        '& fieldset': {
          borderColor: mode === 'dark' ? 'rgba(125,211,252,0.2)' : 'rgba(51,73,132,0.25)',
        },
        '&:hover fieldset': {
          borderColor: mode === 'dark' ? 'rgba(125,211,252,0.45)' : 'rgba(51,73,132,0.5)',
        },
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: mode === 'dark' ? 'rgba(125,211,252,0.1)' : 'rgba(51,73,132,0.12)',
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontFamily,
        background: mode === 'dark' ? '#10254a' : '#334984',
        color: '#dbeafe',
        fontSize: '0.78rem',
        borderRadius: 6,
        border: '1px solid rgba(125,211,252,0.25)',
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 8, background: 'rgba(125,211,252,0.1)' },
      bar:  { background: `linear-gradient(90deg, #1f82b1, ${blue})` },
    },
  },
});

// ── DARK THEME  (institute blue — night) ─────────────────────────────────────
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: blue,   light: '#bae6fd', dark: '#1f82b1'  },
    secondary: { main: amber,  light: '#fcd34d', dark: '#d97706'  },
    error:     { main: '#f87171' },
    warning:   { main: amber   },
    success:   { main: '#4ade80' },
    info:      { main: '#34d399' },
    background: { default: 'rgba(0,0,0,0)', paper: 'rgba(16,37,74,0.55)' },
    text: {
      primary:   '#eff6ff',
      secondary: 'rgba(239,246,255,0.55)',
      disabled:  'rgba(239,246,255,0.28)',
    },
    divider: 'rgba(125,211,252,0.1)',
  },
  shape:      { borderRadius: 10 },
  typography,
  components: components('dark'),
});

// ── LIGHT THEME  (institute blue — daylight) ─────────────────────────────────
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#334984', light: '#1f82b1', dark: '#283b70' },
    secondary: { main: amber,     light: '#fcd34d', dark: '#b45309' },
    error:     { main: '#ef4444' },
    warning:   { main: amber      },
    success:   { main: '#22c55e'  },
    info:      { main: '#10b981'  },
    background: { default: 'rgba(0,0,0,0)', paper: 'rgba(255,255,255,0.92)' },
    text: {
      primary:   '#17213d',
      secondary: 'rgba(23,33,61,0.62)',
      disabled:  'rgba(23,33,61,0.32)',
    },
    divider: 'rgba(51,73,132,0.12)',
  },
  shape:      { borderRadius: 10 },
  typography,
  components: components('light'),
});
