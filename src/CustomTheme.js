import { alpha, createTheme } from '@mui/material';
import '@fontsource/noto-sans/300.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/500.css';
import '@fontsource/noto-sans/700.css';

const customTheme = createTheme({
  typography: {
    fontFamily: 'Noto Sans, sans-serif',
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
            outline: '2px solid white',
          },
        },
      },
      defaultProps: {
        // The props to apply
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
          variant: 'standard',
        },
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          marginBottom: theme.spacing(2),
          '.MuiOutlinedInput-root': {
            marginTop: ownerState.label && theme.spacing(2.5),
            fieldset: {
              legend: {
                // this does what notched:false does, but permanently,
                // and cannot be overriden by mentioning InputProps
                width: 0,
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'transparent',
              fieldset: {
                border: '2px solid',
                borderColor: alpha(theme.palette.primary.light, 0.75),
                boxShadow: `${alpha(
                  theme.palette.primary.light,
                  0.25
                )} 0 0 2px 2px`,
              },
            },
            '&.Mui-error': {
              fieldset: {
                border: '2px solid',
                borderColor: alpha(theme.palette.error.main, 0.75),
                boxShadow: `${alpha(
                  theme.palette.error.main,
                  0.25
                )} 0 0 2px 2px`,
              },
            },
          },
          '.MuiFormHelperText-root': {
            overflowX: 'auto',
          },
        }),
      },
    },
  },
});

export default customTheme;
