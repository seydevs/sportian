import { createTheme } from '@mui/material/styles';

// Sportian brand colors
const colors = {
  navy: {
    main: '#011528',
    light: '#012134',
    dark: '#010d1a',
  },
  lime: {
    main: '#B0DA00',
    light: '#c4e633',
    dark: '#8fb000',
  },
  white: '#FFFFFF',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.lime.main,
      light: colors.lime.light,
      dark: colors.lime.dark,
      contrastText: colors.navy.main,
    },
    secondary: {
      main: colors.navy.light,
      light: '#023a5c',
      dark: colors.navy.dark,
      contrastText: colors.white,
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: colors.lime.main,
    },
    background: {
      default: colors.navy.main,
      paper: colors.navy.light,
    },
    text: {
      primary: colors.white,
      secondary: colors.gray[300],
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.navy.light,
          borderRadius: 16,
          border: `1px solid ${colors.navy.light}`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 24px rgba(0, 0, 0, 0.3)`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        filled: {
          backgroundColor: colors.lime.main,
          color: colors.navy.main,
        },
        outlined: {
          borderColor: colors.gray[500],
          color: colors.white,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.navy.main,
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.navy.light}`,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: colors.navy.light,
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
