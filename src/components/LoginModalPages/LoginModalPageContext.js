import PropTypes from 'prop-types';
import { createContext } from 'react';

export const LoginModalPageContext = createContext();

export function LoginModalPageContextProvider({ value, children }) {
  return (
    <LoginModalPageContext.Provider value={value}>
      {children}
    </LoginModalPageContext.Provider>
  );
}

LoginModalPageContextProvider.propTypes = {
  value: PropTypes.shape({
    setCurrPage: PropTypes.func,
    onClose: PropTypes.func,
  }).isRequired,
  children: PropTypes.element.isRequired,
};
