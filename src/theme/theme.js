import { createTheme } from '@mui/material';

// Create a custom theme with the PicknDeal color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e42e2',
      dark: '#1e32d2',
      light: '#5866e8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#909097',
      dark: '#4b4b4b',
      light: '#b5b5b5',
      contrastText: '#fff',
    },
    text: {
      primary: '#4b4b4b',
      secondary: '#909097',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#2196f3',
    },
    warning: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: '"OpenSans", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInput-underline:before': {
            borderBottomColor: '#b5b5b5',
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#2e42e2',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#2e42e2',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 50px',
          fontSize: '16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(46, 66, 226, 0.4)',
          },
          '&:disabled': {
            opacity: 0.6,
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(46, 66, 226, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          border: '2px solid #e0e0e0',
          color: '#4b4b4b',
          padding: '20px',
          width: '140px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '16px',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          '&:hover': {
            borderColor: '#2e42e2',
            backgroundColor: 'rgba(46, 66, 226, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: '#2e42e2',
            color: '#fff',
            borderColor: '#2e42e2',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(46, 66, 226, 0.3)',
            '&:hover': {
              backgroundColor: '#1e32d2',
              borderColor: '#1e32d2',
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#2e42e2',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme;