import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { auth } from '../../firebase-config';
import { NotificationSnackbarContext } from '../NotificationSnackbarContext';
import { UserDataHandler } from '../../DBHandlers/DBDataConverter';
import { Cart, Wishlist } from './UserDataHelperClasses';
import { UsersDatabase } from '../../DBHandlers/DBManipulatorClasses';

export const UserContext = createContext({});

function UserContextProvider({ children }) {
  const [user, setUser] = useState(auth.currentUser);

  // initialize empty state
  const [userData, setUserData] = useState({
    cart: new Cart(),
    wishlist: new Wishlist(),
  });

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => setUser(newUser));
  }, []);

  const { showNotificationWith } = useContext(NotificationSnackbarContext);
  const FetchedInitialData = useRef(false);
  useEffect(() => {
    // only run if theres a user
    if (!user) return;

    // welcome the user with notification snackbar
    const welcomeName = user.displayName || user.email || user.phoneNumber;
    showNotificationWith({
      message: `Logged in as: ${welcomeName}`,
      variant: 'success',
    });

    /* on login, */
    (async () => {
      /* check if userData document exists */
      let userDataDoc;
      try {
        userDataDoc = await UsersDatabase.get({ userID: user.uid });
      } catch {
        showNotificationWith({
          message:
            'Something went wrong in fetching your data. Please refresh the page, and try again.',
          variant: 'error',
        });
      }

      /* If it exists, extract whatever data's there, and update the corresponding new fields. */
      if (userDataDoc) {
        const cloudData = new UserDataHandler(userDataDoc);
        setUserData(cloudData.toLocalState());
        FetchedInitialData.current = true;
      }
      /* If it doesn't exist, that's fine. Work with the empty instances you have */
    })();
  }, [user]);

  const addToCart = (productName, { count } = {}) => {
    setUserData((oldData) => {
      const oldCart = oldData.cart;
      const newCart = oldCart.clone().add(productName, { count });
      return { ...oldData, cart: newCart };
    });
  };

  const removeFromCart = (productName, { all } = {}) => {
    setUserData((oldData) => {
      const oldCart = oldData.cart;
      const newCart = oldCart.clone().remove(productName, { all });
      return { ...oldData, cart: newCart };
    });
  };

  const toggleWishlist = (productName) => {
    setUserData((oldData) => {
      const oldWishlist = oldData.wishlist;
      const newWishlist = oldWishlist.clone().toggle(productName);
      return { ...oldData, wishlist: newWishlist };
    });
  };

  /* Whenever the userData changes, update the remote document. The local state is the ultimate */
  /* source of truth. The remote is a copy */
  useEffect(() => {
    if (!user || FetchedInitialData.current) {
      FetchedInitialData.current = false;
      return;
    }

    if (userData.cart.isEmpty && userData.wishlist.isEmpty)
      // if everything is empty, delete the doc
      UsersDatabase.delete({ userID: user.uid }).catch(() =>
        showNotificationWith({
          message:
            'Something went wrong in updating your data. Please refresh the page, and try again.',
          variant: 'error',
        })
      );
    else {
      // else update the whole doc with the new userData
      const newUserData = UserDataHandler.toDBForm(userData);
      UsersDatabase.set({ userID: user.uid, data: newUserData }).catch(() =>
        showNotificationWith({
          message:
            'Something went wrong in updating your data. Please refresh the page, and try again.',
          variant: 'error',
        })
      );
    }
  }, [userData]);

  const contextValue = useMemo(
    () => ({
      user,
      addToCart,
      removeFromCart,
      toggleWishlist,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContextProvider;
