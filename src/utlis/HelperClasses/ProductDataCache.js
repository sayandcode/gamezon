import { GameDatabase } from '../DBHandlers/DBManipulatorClasses';
import { getboxArtFor } from '../DBHandlers/MockDBFetch';

class ProductDataCache {
  #cache = {};

  async #addToCache({ productName, getBoxArt = false }) {
    const doc = await GameDatabase.get({ title: productName });
    const boxArtUrl = getBoxArt ? await getboxArtFor(productName) : undefined;
    this.#cache[productName] = { doc, boxArtUrl };
  }

  async get({ productName, getBoxArt = false }) {
    const cachedProduct = this.#cache[productName];
    if (!cachedProduct) await this.#addToCache({ productName, getBoxArt });
    return this.#cache[productName];
  }

  dispose() {
    Object.values(this.#cache).forEach(({ boxArtUrl }) =>
      URL.revokeObjectURL(boxArtUrl)
    );
    this.#cache = {};
  }
}

export default ProductDataCache;
