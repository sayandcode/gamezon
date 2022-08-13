import { AddressList, Cart, Wishlist } from './UserDataHelperClasses';

/* HANDLERS EXPOSE THE FUNCTIONALITY VIA CONTEXT API */
// Handlers extend the base class by adding access to react hooks,
// and editing the state of the context

class CartHandler extends Cart {
  #setUserData;

  constructor(cart, setUserData) {
    super(cart.contents);
    this.#setUserData = setUserData;
  }

  #updateCartInUserData(fnName, ...args) {
    this.#setUserData((oldData) => {
      const oldCart = oldData.cart;
      const newCart = oldCart[fnName](...args);
      return { ...oldData, cart: newCart, isFromCloud: false };
    });
  }

  /* 👇 public methods 👇 */

  add(productName, variant, { count } = {}) {
    this.#updateCartInUserData('add', productName, variant, { count });
  }

  remove(productName, variant, { all } = {}) {
    this.#updateCartInUserData('remove', productName, variant, { all });
  }

  empty() {
    this.#setUserData((oldData) => ({
      ...oldData,
      cart: new Cart(),
      isFromCloud: false,
    }));
  }
}

class WishlistHandler extends Wishlist {
  #origContents;

  #setUserData;

  constructor(wishlist, setUserDataFn) {
    super(wishlist.contents);
    this.#origContents = wishlist.contents;
    this.#setUserData = setUserDataFn;
  }

  /* 👇 public methods 👇 */

  get contents() {
    // This implementation of contents is an array, which is useful for context consumers.
    // There is a dedicated find function, if they wish to look at a particular component.
    // Contents is used mainly to list out the items in the cart. So an array makes more sense
    return Object.values(this.#origContents);
  }

  toggle(productName) {
    this.#setUserData((oldData) => {
      const oldWishlist = oldData.wishlist;
      const newWishlist = oldWishlist.toggle(productName);
      return { ...oldData, wishlist: newWishlist, isFromCloud: false };
    });
  }
}

class AddressListHandler extends AddressList {
  #origContents;

  #setUserData;

  constructor(addressList, setUserDataFn) {
    super(addressList.contents);
    this.#origContents = addressList.contents;
    this.#setUserData = setUserDataFn;
  }

  #updateAddressListInUserData(fnName, ...args) {
    this.#setUserData((oldData) => {
      const oldAddressList = oldData.addressList;
      const newAddressList = oldAddressList[fnName](...args);
      return { ...oldData, addressList: newAddressList, isFromCloud: false };
    });
  }

  /* 👇 public methods 👇 */

  get contents() {
    return Object.values(this.#origContents);
  }

  add(addressObj) {
    this.#updateAddressListInUserData('add', addressObj);
  }

  remove(address) {
    this.#updateAddressListInUserData('remove', address);
  }

  edit(oldAddress, newAddress) {
    this.#updateAddressListInUserData('edit', oldAddress, newAddress);
  }
}

export { CartHandler, WishlistHandler, AddressListHandler };
