import { useState, createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

export const LoginModalContext = createContext({
  open: false,
  onClose: () => {},
  showLoginModal: () => {},
});

export function LoginModalContextProvider({ children }) {
  const [open, setOpen] = useState(false);

  const showLoginModal = () => setOpen(true);

  const onClose = () => setOpen(false);

  const contextValue = useMemo(
    () => ({ open, onClose, showLoginModal }),
    [open]
  );
  return (
    <LoginModalContext.Provider value={contextValue}>
      {children}
    </LoginModalContext.Provider>
  );
}

LoginModalContextProvider.propTypes = {
  children: PropTypes.node,
};

LoginModalContextProvider.defaultProps = {
  children: '',
};
