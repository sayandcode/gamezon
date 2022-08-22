import Price from '../../../utlis/HelperClasses/Price';
import ProductDataCache from '../../../utlis/HelperClasses/ProductDataCache';
import CartPageItemHandler from './CartPageItemHandler';

class CartPageDataHandler {
  /* We could have put the cache inside the cartPageItem, for convenience.
  However, logically it makes sense that the CartDataHandler should have direct control of 
  the cache and orderItems. */
  static #productDataCache = new ProductDataCache();

  static dispose() {
    this.#productDataCache.dispose();
  }

  static async createFor(cartItems) {
    const CartPageItems = await Promise.all(
      cartItems.map(async (cartItem) =>
        CartPageItemHandler.createFor(cartItem, {
          productDataCache: this.#productDataCache,
        })
      )
    );
    return new this(CartPageItems);
  }

  #items;

  constructor(cartPageItems) {
    this.#items = cartPageItems;
  }

  get items() {
    return this.#items;
  }

  get cartTotalPrice() {
    const totalPriceOfEachItem = this.#items.map((item) => item.totalPrice);
    const cartTotalPrice = totalPriceOfEachItem.reduce((currTotal, thisPrice) =>
      Price.add(currTotal, thisPrice)
    );
    return cartTotalPrice;
  }
}

export default CartPageDataHandler;
