import PropTypes from 'prop-types';
import { createContext, useMemo, useState } from 'react';

export const NotificationSnackbarContext = createContext({
  open: false,
  closeSnackbar: () => {},
  message: '',
  variant: '',
});

export default function NotificationSnackbarContextProvider({ children }) {
  const [notificationSnackbarConfig, setNotificationSnackbarConfig] = useState({
    open: false,
    onClose: () => {
      setNotificationSnackbarConfig((oldConfig) => ({
        ...oldConfig,
        open: false,
      }));
    },
    message: '',
    variant: null,
  });

  const showNotificationWith = ({ message, variant }) => {
    setNotificationSnackbarConfig((oldConfig) =>
      setNotificationSnackbarConfig({
        ...oldConfig,
        open: true,
        message,
        variant,
      })
    );
  };

  const contextValue = useMemo(
    () => ({
      notificationSnackbarConfig,
      showNotificationWith,
    }),
    [notificationSnackbarConfig]
  );

  return (
    <NotificationSnackbarContext.Provider value={contextValue}>
      {children}
    </NotificationSnackbarContext.Provider>
  );
}

NotificationSnackbarContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
