import RootDatabaseEntity from '../../DBHandlers/DBDataConverter';
import AddressList from './UserDataHelperClasses/AddressList/AddressList';
import Cart from './UserDataHelperClasses/Cart';
import Wishlist from './UserDataHelperClasses/Wishlist';

class UserDataHandler extends RootDatabaseEntity {
  constructor(doc) {
    super(doc);
    const { data } = doc;
    this.cartItems = data.cartItems;
    this.wishlistItems = data.wishlistItems;
    this.addressListItems = data.addressListItems;
  }

  toLocalState() {
    return {
      // if the field doesn't exist, it defaults to the empty initialization of the class. So it works anyway
      cart: new Cart(this.cartItems),
      wishlist: new Wishlist(this.wishlistItems),
      addressList: AddressList.createFromObject(this.addressListItems),
    };
  }

  static toDBForm(localData) {
    const [cart, wishlist, addressList] = [
      localData.cart,
      localData.wishlist,
      localData.addressList,
    ];

    // if a field is empty, delete the field
    const cartItems = cart.isEmpty ? undefined : cart.contents;
    const wishlistItems = wishlist.isEmpty ? undefined : wishlist.contents;
    const addressListItems = addressList.isEmpty
      ? undefined
      : addressList.objectifiedContents;

    return {
      ...(cartItems && { cartItems }),
      ...(wishlistItems && { wishlistItems }),
      ...(addressListItems && { addressListItems }),
    };
  }
}

export default UserDataHandler;
