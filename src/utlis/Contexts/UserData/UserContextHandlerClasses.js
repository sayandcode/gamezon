import { Cart, Wishlist } from './UserDataHelperClasses';

/* HANDLERS EXPOSE THE FUNCTIONALITY VIA CONTEXT API */
// Handlers extend the base class by adding access to react hooks,
// and editing the state of the context

class CartHandler extends Cart {
  #origContents;

  #setUserData;

  constructor(cart, setUserData) {
    super(cart.contents);
    this.#origContents = cart.contents;
    this.#setUserData = setUserData;
  }

  #updateCartInUserData(fnName, ...args) {
    this.#setUserData((oldData) => {
      const oldCart = oldData.cart;
      const newCart = oldCart.clone()[fnName](...args);
      return { ...oldData, cart: newCart, isFromCloud: false };
    });
  }

  /* 👇 public methods 👇 */

  get contents() {
    // This implementation of contents is an array, which is useful for context consumers.
    // There is a dedicated find function, if they wish to look at a particular component.
    // Contents is used mainly to list out the items in the cart. So an array makes more sense
    return Object.values(this.#origContents);
  }

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
    return Object.values(this.#origContents);
  }

  toggle(productName) {
    this.#setUserData((oldData) => {
      const oldWishlist = oldData.wishlist;
      const newWishlist = oldWishlist.clone().toggle(productName);
      return { ...oldData, wishlist: newWishlist, isFromCloud: false };
    });
  }
}

export { CartHandler, WishlistHandler };
