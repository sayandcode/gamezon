import { GameDatabase } from '../../../utlis/DBHandlers/DBManipulatorClasses';
import { GameDatabaseQuery } from '../../../utlis/DBHandlers/DBQueryClasses';
import { getDataFromQuery } from '../../../utlis/DBHandlers/DBFetch';
import ImageCarouselItem from './ImageCarouselItem';

class ImageCarouselDataHandler {
  static async #getDataFromDB(items) {
    if (items instanceof GameDatabaseQuery) {
      return getDataFromQuery(items);
    }
    if (Array.isArray(items)) {
      return Promise.all(
        items.map(async (title) => GameDatabase.get({ title }))
      );
    }
    throw new Error('Items is neither a query or a predetermined list');
  }

  static async createFor(items) {
    const queriedItems = await this.#getDataFromDB(items);
    const newCarouselItems = await Promise.allSettledFiltered(
      queriedItems.map(async (item) => ImageCarouselItem.createFrom(item))
    );
    return new this(newCarouselItems);
  }

  #carouselItems;

  constructor(carouselItems) {
    this.#carouselItems = carouselItems;
  }

  get items() {
    return this.#carouselItems;
  }
}

export default ImageCarouselDataHandler;
