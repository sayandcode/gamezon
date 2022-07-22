import { ThemeProvider, CssBaseline } from '@mui/material';
import PropTypes from 'prop-types';
import customTheme from '../../CustomTheme';
import UserContextProvider from './UserData/UserContext';
import { LoginModalContextProvider } from './LoginModalContext';
import NotificationSnackbarContextProvider from './NotificationSnackbarContext';

export default function ContextProvidersWrapper({ children }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <NotificationSnackbarContextProvider>
        <UserContextProvider>
          <LoginModalContextProvider>{children}</LoginModalContextProvider>
        </UserContextProvider>
      </NotificationSnackbarContextProvider>
    </ThemeProvider>
  );
}

ContextProvidersWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
