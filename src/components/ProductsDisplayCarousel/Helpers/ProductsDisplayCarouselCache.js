import { GameDatabase } from '../../../utlis/DBHandlers/DBManipulatorClasses';
import { GameDatabaseQuery } from '../../../utlis/DBHandlers/DBQueryClasses';
import { getDataFromQuery } from '../../../utlis/DBHandlers/MockDBFetch';
import ProductsDisplayCarouselItemHandler from './ProductsDisplayCarouselItemHandler';

class ProductsDisplayCarouselCache {
  #cache = [];

  #moreItemsAvailable = true;

  async #updateCache(items, rangeEnd) {
    const [queriedItemDocs, { moreItemsAvailable }] = await this.#getDataFromDB(
      items,
      rangeEnd
    );
    this.#moreItemsAvailable = moreItemsAvailable;
    const newCarouselItems = await Promise.allSettledFiltered(
      queriedItemDocs.map(async (itemDoc) =>
        ProductsDisplayCarouselItemHandler.createFrom(itemDoc)
      )
    );
    this.#cache.push(...newCarouselItems);
  }

  async #getDataFromDB(items, rangeEnd) {
    /* FUNCTION OVERLOADING V1: ITEMS IS A DBQUERY */
    if (items instanceof GameDatabaseQuery)
      return this.#fetchForItemsQuery(items, rangeEnd);
    /* FUNCTION OVERLOADING V2: ITEMS IS AN ARRAY */
    if (Array.isArray(items)) return this.#fetchForItemsArray(items, rangeEnd);
    throw new Error(
      'Items should either be a GameDatabaseQuery, or an array of product names'
    );
  }

  async #fetchForItemsQuery(items, rangeEnd) {
    // take the last item in the carouselItems array, and start at that one.
    // That way, we query only the ones that are extra
    const lastFetchedItem = this.#cache.slice(-1)[0];
    const noOfItemsToFetch = rangeEnd - this.highestIndex + 1; // fetch one extra, to see if there are more items available
    const subsetQuery = items
      .limit(noOfItemsToFetch)
      .startAfter(lastFetchedItem); // startAfter method can also work with undefined. It just ignores the call
    const data = await getDataFromQuery(subsetQuery);

    const extraItem = data[noOfItemsToFetch - 1]; // (noOfItemsToFetch - 1) is the last item cause thats how indexes work
    const moreItemsAvailable = Boolean(extraItem);
    return [data, { moreItemsAvailable }];
  }

  async #fetchForItemsArray(items, rangeEnd) {
    const startIndex = this.highestIndex === -1 ? 0 : this.highestIndex + 1;
    const data = await Promise.all(
      items
        .slice(startIndex, rangeEnd + 1)
        .map((_title) => GameDatabase.get({ title: _title }))
    );

    const finalArrayLength = this.#cache.length + data.length;
    const moreItemsAvailable = items.length > finalArrayLength;
    return [data, { moreItemsAvailable }];
  }

  /* 👇 PUBLIC METHODS 👇 */

  async fetch(items, { rangeStart, rangeEnd }) {
    // if the required data isn't already in cache, fetch it.
    if (rangeEnd > this.highestIndex) await this.#updateCache(items, rangeEnd);

    // finally return the required items
    return this.#cache.slice(rangeStart, rangeEnd + 1); // +1 for how slice works
  }

  clear() {
    this.#cache.forEach((item) => item.dispose());
    this.#cache = [];
  }

  get moreItemsAvailable() {
    return this.#moreItemsAvailable;
  }

  get highestIndex() {
    return this.#cache.length - 1;
  }
}
export default ProductsDisplayCarouselCache;
