import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './Contexts/UserData/UserContext';

function RedirectIfNotLoggedIn({ children }) {
  const { user } = useContext(UserContext);
  // Only access page if logged in
  if (!user) return <Navigate to="/" />;
  return children;
}

RedirectIfNotLoggedIn.propTypes = {
  children: PropTypes.node.isRequired,
};
export default RedirectIfNotLoggedIn;
