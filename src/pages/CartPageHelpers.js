import { CartItemDataHandler } from '../utlis/DBHandlers/DBDataConverter';
import { GameDatabase } from '../utlis/DBHandlers/DBManipulatorClasses';
import { getboxArtFor } from '../utlis/DBHandlers/MockDBFetch';

class CartProductDataCache {
  #cache = {};

  get productIDs() {
    return Object.keys(this.#cache);
  }

  async addToCache(cartItem) {
    const title = cartItem.name;
    const cartItemDoc = await GameDatabase.get({ title });
    const boxArtUrl = await getboxArtFor(title);

    this.#cache[cartItem.productID] = { doc: cartItemDoc, boxArtUrl };
  }

  filter(cartItems) {
    const requiredProductIDs = cartItems.map((item) => item.productID);
    const oldCache = this.#cache;
    const newCache = {};
    requiredProductIDs.forEach((id) => {
      newCache[id] = oldCache[id];
    });
    this.#cache = newCache;
  }

  generateHandlerFor(cartItem) {
    // The cartItemsData has two parts: The productData and cartData.
    // Since cart data is updated anyway, and is driving the whole thing, nothing to optimise there.
    // But productData doesn't change, so we can cache it locally.
    // Hence the cartItemsData is generated dynamically, with the constant productData, and the changing cartData
    const cachedProductData = this.#cache[cartItem.productID];
    if (!cachedProductData) throw new Error('Cart Item not cached');

    return new CartItemDataHandler(cartItem, cachedProductData);
  }

  dispose() {
    Object.values(this.#cache).forEach(({ boxArtUrl }) =>
      URL.revokeObjectURL(boxArtUrl)
    );
  }
}

// eslint-disable-next-line import/prefer-default-export
export { CartProductDataCache };
