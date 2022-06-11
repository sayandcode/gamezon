import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { PropTypes } from 'prop-types';
import customTheme from '../../CustomTheme';
import FirebaseContextProvider from './FirebaseContext';

export default function ContextProvidersWrapper({ children }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <FirebaseContextProvider>{children}</FirebaseContextProvider>;
    </ThemeProvider>
  );
}

ContextProvidersWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
