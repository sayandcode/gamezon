import ProductsDisplayCarouselCache from './ProductsDisplayCarouselCache';

class ProductsDisplayCarouselDataHandler {
  static #itemsCache = new ProductsDisplayCarouselCache();

  static async createFor(items, { rangeStart, rangeEnd }) {
    const carouselItemsDataHandlers = await this.#itemsCache.fetch(items, {
      rangeStart,
      rangeEnd,
    });
    return new this({
      carouselItemsDataHandlers,
      rangeStart,
      rangeEnd,
    });
  }

  #carouselItems;

  #rangeStart;

  #rangeEnd;

  constructor({ carouselItemsDataHandlers, rangeStart, rangeEnd }) {
    this.#rangeStart = rangeStart;
    this.#rangeEnd = rangeEnd;
    this.#carouselItems = carouselItemsDataHandlers;
  }

  get carouselItems() {
    return this.#carouselItems;
  }

  get showArrow() {
    const cache = this.constructor.#itemsCache;
    return {
      left: this.#rangeStart !== 0,
      right: cache.moreItemsAvailable || this.#rangeEnd < cache.highestIndex,
    };
  }

  static clearCache() {
    this.#itemsCache.clear();
  }
}
export default ProductsDisplayCarouselDataHandler;
