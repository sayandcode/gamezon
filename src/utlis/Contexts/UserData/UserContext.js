import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { NotificationSnackbarContext } from '../NotificationSnackbarContext';
import UserDataHandler from './UserDataHandler';
import Cart from './UserDataHelperClasses/Cart';
import Wishlist from './UserDataHelperClasses/Wishlist';
import AddressList from './UserDataHelperClasses/AddressList/AddressList';
import { UsersDatabase } from '../../DBHandlers/DBManipulatorClasses';
import UserContextHandler from './UserContextHandlerClasses';
import { LoginModalContext } from '../LoginModalContext';

export const UserContext = createContext({});

const emptyUserData = {
  cart: new Cart(),
  wishlist: new Wishlist(),
  addressList: new AddressList(),
  isFromCloud: null,
};

function UserContextProvider({ children }) {
  const [user, setUser] = useState(auth.currentUser);

  /* INITIALIZE EMPTY STATE */
  const [userData, setUserData] = useState(emptyUserData);

  /* UTILITIES */
  const { showLoginModal } = useContext(LoginModalContext);
  const { showNotificationWith } = useContext(NotificationSnackbarContext);

  /* CHANGES IN USER LOGIN STATE */
  // Subscribe to changes
  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => setUser(newUser));
  }, []);
  // React to user state changes
  useEffect(() => {
    if (user) loginPath();
    else logoutPath();
  }, [user]);

  /* CHANGES IN USERDATA */
  // Whenever the local userData changes, update the remote document. The local state is the ultimate
  // source of truth. The remote is a copy
  useEffect(() => {
    // The first backend fetch changes the data, but doesn't require an update, cause it's already in the cloud.
    // If the data is from the cloud, theres not need to update it after fetching the changes locally
    const updateIsValid = user && !userData.isFromCloud;
    if (updateIsValid) updateCloudData();
  }, [userData]);

  function loginPath() {
    welcomeUser();
    syncUserDataFromCloud();
  }

  function logoutPath() {
    setUserData(emptyUserData);
  }

  function welcomeUser() {
    // welcome the user with notification snackbar
    const welcomeName = user.displayName || user.email || user.phoneNumber;
    showNotificationWith({
      message: `Logged in as: ${welcomeName}`,
      variant: 'success',
    });
  }

  async function syncUserDataFromCloud() {
    // check if userData document exists
    const userDataDoc = await fetchUserDataFromCloud();

    // If it exists, extract whatever data's there, and update the corresponding new fields.
    // If it doesn't exist, that's fine. Work with the empty instances you have
    if (userDataDoc) setUserDataLocally(userDataDoc);

    async function fetchUserDataFromCloud() {
      try {
        return await UsersDatabase.get({ userID: user.uid });
      } catch {
        showNotificationWith({
          message:
            'Something went wrong in fetching your data. Please refresh the page, and try again.',
          variant: 'error',
        });
      }
      // if data doesn't exist
      return null;
    }

    function setUserDataLocally(_userDataDoc) {
      const cloudData = new UserDataHandler(_userDataDoc);
      const localData = { ...cloudData.toLocalState(), isFromCloud: true };
      setUserData(localData);
    }
  }

  function updateCloudData() {
    const userDataIsEmpty =
      userData.cart.isEmpty &&
      userData.wishlist.isEmpty &&
      userData.addressList.isEmpty;

    if (userDataIsEmpty)
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
  }

  /* ALLOW USERS TO CHECKOUT THEIR CARTS */
  const navigate = useNavigate();
  function checkout(cart) {
    if (!user) {
      showLoginModal();
      return;
    }
    // serializing and deserializing is necessary because of the nature of navigate-state/useLocation
    const serializedCart = cart.contents;
    navigate('/checkout', {
      state: { serializedCart, prevHash: window.location.hash },
    });
  }

  /* GIVE ABILITY TO MANIPULATE USERDATA USING CONTEXT */
  // Handlers expose the functionality of the base classes, while having access to the
  // react state of the context provider, thereby extending the functionality
  // a la dependency injection
  const userContextHandler = useMemo(
    () =>
      new UserContextHandler({
        user,
        userData,
        setUserData,
        showLoginModal,
      }),
    [user, userData]
  );

  const cartHandler = userContextHandler.extend({
    baseName: 'cart',
    updateFor: ['add', 'remove', 'empty'],
    requireAuthFor: ['add', 'remove'],
  });
  const wishlistHandler = userContextHandler.extend({
    baseName: 'wishlist',
    updateFor: ['toggle'],
    requireAuthFor: ['toggle'],
    contentsIsArray: true,
  });
  const addressListHandler = userContextHandler.extend({
    baseName: 'addressList',
    updateFor: ['add', 'remove', 'edit'],
    requireAuthFor: ['add', 'remove', 'edit'],
    contentsIsArray: true,
  });

  const contextValue = useMemo(
    () => ({
      user,
      cart: cartHandler,
      wishlist: wishlistHandler,
      addressList: addressListHandler,
      checkout,
    }),
    [user, userData]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContextProvider;
