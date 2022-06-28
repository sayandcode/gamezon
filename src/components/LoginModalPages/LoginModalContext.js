import PropTypes from 'prop-types';
import { createContext } from 'react';

export const LoginModalContext = createContext();

export function LoginModalContextProvider({ value, children }) {
  return (
    <LoginModalContext.Provider value={value}>
      {children}
    </LoginModalContext.Provider>
  );
}

LoginModalContextProvider.propTypes = {
  value: PropTypes.shape({
    setCurrPage: PropTypes.func,
    onClose: PropTypes.func,
  }).isRequired,
  children: PropTypes.element.isRequired,
};
