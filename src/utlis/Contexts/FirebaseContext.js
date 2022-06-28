import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase-config';

export const FirebaseContext = createContext({});

function FirebaseContextProvider({ children }) {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => setUser(newUser));
  }, []);

  return (
    <FirebaseContext.Provider value={user}>{children}</FirebaseContext.Provider>
  );
}

FirebaseContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FirebaseContextProvider;
