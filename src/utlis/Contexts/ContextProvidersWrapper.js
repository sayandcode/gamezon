import { ThemeProvider, CssBaseline } from '@mui/material';
import PropTypes from 'prop-types';
import customTheme from '../../CustomTheme';
import FirebaseContextProvider from './FirebaseContext';
import NotificationSnackbarContextProvider from './NotificationSnackbarContext';
import TodaysOffersContextProvider from './TodaysOffersContext';

export default function ContextProvidersWrapper({ children }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <FirebaseContextProvider>
        <NotificationSnackbarContextProvider>
          <TodaysOffersContextProvider>{children}</TodaysOffersContextProvider>
        </NotificationSnackbarContextProvider>
      </FirebaseContextProvider>
    </ThemeProvider>
  );
}

ContextProvidersWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
