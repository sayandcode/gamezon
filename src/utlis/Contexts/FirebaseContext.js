import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { NotificationSnackbarContext } from './NotificationSnackbarContext';

export const FirebaseContext = createContext({});

function FirebaseContextProvider({ children }) {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => setUser(newUser));
  }, []);

  const { showNotificationWith } = useContext(NotificationSnackbarContext);
  useEffect(() => {
    if (user) {
      const welcomeName = user.displayName || user.email || user.phoneNumber;
      showNotificationWith({
        message: `Logged in as: ${welcomeName}`,
        variant: 'success',
      });
    }
  }, [user]);

  return (
    <FirebaseContext.Provider value={user}>{children}</FirebaseContext.Provider>
  );
}

FirebaseContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FirebaseContextProvider;
