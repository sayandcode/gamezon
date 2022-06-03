import { createTheme } from '@mui/material';
import '@fontsource/noto-sans/300.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/500.css';
import '@fontsource/noto-sans/700.css';

const defaultTheme = createTheme();

const customTheme = createTheme({
  typography: {
    fontFamily: 'Noto Sans, serif',
  },
  palette: {
    primary: {
      main: '#002255',
    },
    secondary: {
      main: '#EB5E55',
    },
    background: {
      default: '#E1E2E1',
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: `2px solid ${defaultTheme.palette.common.white}`,
          },
        },
      },
      defaultProps: {
        // The props to apply
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
  },
});

export default customTheme;
