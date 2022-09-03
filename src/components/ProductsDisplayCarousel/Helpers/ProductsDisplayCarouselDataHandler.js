import ProductsDisplayCarouselCache from './ProductsDisplayCarouselCache';

class ProductsDisplayCarouselDataHandler {
  #itemsCache = new ProductsDisplayCarouselCache();

  async getItems(items, { rangeStart, rangeEnd }) {
    const cache = this.#itemsCache;
    const carouselItems = await cache.fetch(items, { rangeStart, rangeEnd });
    const showArrow = {
      left: rangeStart !== 0,
      right: cache.moreItemsAvailable || rangeEnd < cache.highestIndex,
    };

    const returnObj = {
      carouselItems,
      showArrow,
    };
    Object.freeze(returnObj); // read-only
    return returnObj;
  }

  dispose() {
    this.#itemsCache.clear();
  }
}
export default ProductsDisplayCarouselDataHandler;
