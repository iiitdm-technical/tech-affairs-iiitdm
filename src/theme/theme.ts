import { createTheme } from '@mui/material/styles';

const fontFamily = "var(--font-bricolage), 'Roboto', system-ui, sans-serif";

// ── Circuit Board / PCB palette ──────────────────────────────────────────────
// Primary   : Electric lime      #a3e635   (solder mask text / trace highlight)
// Secondary : Amber / gold       #f59e0b   (component labels / warm accent)
// Dark bg   : Near-black green   #030a06   (FR4 board substrate)
// Mid tone  : Deep forest green  #052e16   (ground plane)
// Light bg  : Crisp off-white    #f7fef5   (bare copper reveal)
// Glow      : Neon green         #4ade80   (LED / trace glow)

const lime   = '#a3e635';
const amber  = '#f59e0b';
const neon   = '#4ade80';
const darkBg = '#030a06';

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
        background: `linear-gradient(135deg, #16a34a, ${lime})`,
        color: '#030a06',
        boxShadow: `0 4px 20px -4px rgba(163,230,53,0.45)`,
        '&:hover': {
          background: `linear-gradient(135deg, #15803d, #84cc16)`,
          boxShadow: `0 8px 32px -4px rgba(163,230,53,0.55)`,
          transform: 'translateY(-1px)',
        },
      } : {
        background: `linear-gradient(135deg, #15803d, #16a34a)`,
        color: '#f0fdf4',
        boxShadow: `0 4px 20px -4px rgba(21,128,61,0.45)`,
        '&:hover': {
          background: `linear-gradient(135deg, #166534, #15803d)`,
          boxShadow: `0 8px 32px -4px rgba(21,128,61,0.55)`,
          transform: 'translateY(-1px)',
        },
      },
      outlined: {
        borderColor: mode === 'dark' ? 'rgba(163,230,53,0.3)' : 'rgba(21,128,61,0.35)',
        color: mode === 'dark' ? lime : '#15803d',
        '&:hover': {
          borderColor: mode === 'dark' ? lime : '#16a34a',
          background: mode === 'dark' ? 'rgba(163,230,53,0.07)' : 'rgba(21,128,61,0.07)',
          transform: 'translateY(-1px)',
        },
      },
      text: {
        color: mode === 'dark' ? lime : '#15803d',
        '&:hover': {
          background: mode === 'dark' ? 'rgba(163,230,53,0.08)' : 'rgba(21,128,61,0.07)',
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
          ? '1px solid rgba(163,230,53,0.1)'
          : '1px solid rgba(21,128,61,0.15)',
        boxShadow: 'none',
        background: mode === 'dark'
          ? 'rgba(5,46,22,0.55)'
          : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.3s cubic-bezier(.22,.61,.36,1), box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.01)',
          borderColor: mode === 'dark' ? 'rgba(163,230,53,0.35)' : 'rgba(21,128,61,0.4)',
          boxShadow: mode === 'dark'
            ? '0 20px 48px -12px rgba(163,230,53,0.2), 0 0 0 1px rgba(163,230,53,0.12)'
            : '0 20px 48px -12px rgba(21,128,61,0.18)',
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        background: mode === 'dark' ? 'rgba(3,15,8,0.88)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        border: mode === 'dark'
          ? '1px solid rgba(163,230,53,0.1)'
          : '1px solid rgba(21,128,61,0.12)',
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
        '&.Mui-selected': { color: mode === 'dark' ? lime : '#15803d' },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: { fontFamily, fontWeight: 600, borderRadius: 6 },
      colorPrimary: {
        background: mode === 'dark' ? 'rgba(163,230,53,0.12)' : 'rgba(21,128,61,0.1)',
        color: mode === 'dark' ? lime : '#15803d',
        border: mode === 'dark' ? '1px solid rgba(163,230,53,0.25)' : '1px solid rgba(21,128,61,0.25)',
      },
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root: {
        fontFamily,
        '& fieldset': {
          borderColor: mode === 'dark' ? 'rgba(163,230,53,0.2)' : 'rgba(21,128,61,0.25)',
        },
        '&:hover fieldset': {
          borderColor: mode === 'dark' ? 'rgba(163,230,53,0.45)' : 'rgba(21,128,61,0.5)',
        },
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: mode === 'dark' ? 'rgba(163,230,53,0.1)' : 'rgba(21,128,61,0.12)',
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontFamily,
        background: mode === 'dark' ? '#052e16' : '#14532d',
        color: '#d1fae5',
        fontSize: '0.78rem',
        borderRadius: 6,
        border: '1px solid rgba(163,230,53,0.25)',
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 8, background: 'rgba(163,230,53,0.1)' },
      bar:  { background: `linear-gradient(90deg, #16a34a, ${lime})` },
    },
  },
});

// ── DARK THEME  (PCB board — night) ──────────────────────────────────────────
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: lime,   light: '#bef264', dark: '#65a30d'  },
    secondary: { main: amber,  light: '#fcd34d', dark: '#d97706'  },
    error:     { main: '#f87171' },
    warning:   { main: amber   },
    success:   { main: neon    },
    info:      { main: '#34d399' },
    background: { default: 'rgba(0,0,0,0)', paper: 'rgba(5,46,22,0.55)' },
    text: {
      primary:   '#ecfdf5',
      secondary: 'rgba(236,253,245,0.55)',
      disabled:  'rgba(236,253,245,0.28)',
    },
    divider: 'rgba(163,230,53,0.1)',
  },
  shape:      { borderRadius: 10 },
  typography,
  components: components('dark'),
});

// ── LIGHT THEME  (PCB board — daylight) ──────────────────────────────────────
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#16a34a', light: '#4ade80', dark: '#166534' },
    secondary: { main: amber,     light: '#fcd34d', dark: '#b45309' },
    error:     { main: '#ef4444' },
    warning:   { main: amber      },
    success:   { main: '#22c55e'  },
    info:      { main: '#10b981'  },
    background: { default: 'rgba(0,0,0,0)', paper: 'rgba(255,255,255,0.92)' },
    text: {
      primary:   '#052e16',
      secondary: 'rgba(5,46,22,0.62)',
      disabled:  'rgba(5,46,22,0.32)',
    },
    divider: 'rgba(21,128,61,0.12)',
  },
  shape:      { borderRadius: 10 },
  typography,
  components: components('light'),
});
