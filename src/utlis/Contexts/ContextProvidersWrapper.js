import { ThemeProvider, CssBaseline } from '@mui/material';
import PropTypes from 'prop-types';
import customTheme from '../../CustomTheme';
import FirebaseContextProvider from './FirebaseContext';
import { LoginModalContextProvider } from './LoginModalContext';
import NotificationSnackbarContextProvider from './NotificationSnackbarContext';

export default function ContextProvidersWrapper({ children }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <NotificationSnackbarContextProvider>
        <FirebaseContextProvider>
          <LoginModalContextProvider>{children}</LoginModalContextProvider>
        </FirebaseContextProvider>
      </NotificationSnackbarContextProvider>
    </ThemeProvider>
  );
}

ContextProvidersWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
