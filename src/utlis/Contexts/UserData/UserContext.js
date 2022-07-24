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

  /* INITIALIZE EMPTY STATE */
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

    // on login,
    (async () => {
      // check if userData document exists
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

      // If it exists, extract whatever data's there, and update the corresponding new fields.
      if (userDataDoc) {
        const cloudData = new UserDataHandler(userDataDoc);
        setUserData(cloudData.toLocalState());
        FetchedInitialData.current = true;
      }
      // If it doesn't exist, that's fine. Work with the empty instances you have
    })();
  }, [user]);

  /* Whenever the userData changes, update the remote document. The local state is the ultimate */
  /* source of truth. The remote is a copy */
  useEffect(() => {
    const updateIsRedundant = !user || FetchedInitialData.current;
    // the first backend fetch changes the data, but doesn't require an update, cause it's already in the cloud
    if (FetchedInitialData.current) FetchedInitialData.current = false;
    if (updateIsRedundant) return;

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
  /* GIVE ABILITY TO MANIPULATE USERDATA USING CONTEXT */
  const contextValue = useMemo(
    () => ({
      user,
      cart: {
        // This implementation of contents is an array, which is useful for context consumers.
        // There is a dedicated find function, if they wish to look at a particular component.
        // Contents is used mainly to list out the items in the cart. So an array makes more sense
        contents: Object.values(userData.cart.contents),

        count: userData.cart.count,
        add(productName, variant, { count } = {}) {
          setUserData((oldData) => {
            const oldCart = oldData.cart;
            const newCart = oldCart
              .clone()
              .add(productName, variant, { count });
            return { ...oldData, cart: newCart };
          });
        },
        remove(productName, variant, { all } = {}) {
          setUserData((oldData) => {
            const oldCart = oldData.cart;
            const newCart = oldCart
              .clone()
              .remove(productName, variant, { all });
            return { ...oldData, cart: newCart };
          });
        },
        find(productName, variant) {
          return userData.cart.find(productName, variant);
        },
        empty() {
          setUserData((oldData) => ({ ...oldData, cart: new Cart() }));
        },
      },
      wishlist: {
        contents: userData.wishlist.contents,
        count: userData.wishlist.count,
        toggle(productName) {
          setUserData((oldData) => {
            const oldWishlist = oldData.wishlist;
            const newWishlist = oldWishlist.clone().toggle(productName);
            return { ...oldData, wishlist: newWishlist };
          });
        },
        find(productName) {
          return userData.wishlist.find(productName);
        },
      },
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
