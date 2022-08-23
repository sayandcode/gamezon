import RootDatabaseEntity from '../../../utlis/DBHandlers/DBDataConverter';
import { getboxArtFor } from '../../../utlis/DBHandlers/MockDBFetch';
import Price from '../../../utlis/HelperClasses/Price';

class ProductsDisplayCarouselItemHandler extends RootDatabaseEntity {
  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const boxArtUrl = await getboxArtFor(gameTitle);

    return new this(doc, { boxArtUrl });
  }

  #title;

  #price;

  #discountFraction;

  #boxArtUrl;

  #variant;

  constructor(doc, { boxArtUrl }) {
    super(doc);
    const {
      Title,
      startingPrice: priceObj,
      discount: discountFraction,
    } = doc.data;
    const { data } = doc;

    this.#title = Title;
    this.#price = new Price(priceObj);
    this.#discountFraction = discountFraction;
    this.#boxArtUrl = boxArtUrl;
    this.#variant = data.variants[0].consoleName;
  }

  get title() {
    return this.#title;
  }

  get price() {
    return this.#price;
  }

  get boxArtUrl() {
    return this.#boxArtUrl;
  }

  get variant() {
    return this.#variant;
  }

  get discount() {
    if (!this.#discountFraction) return undefined;
    return {
      percent: (this.#discountFraction * 100).toFixed(0),
      price: this.#price.multiply(1 - this.#discountFraction),
    };
  }

  dispose() {
    URL.revokeObjectURL(this.#boxArtUrl);
  }
}

export default ProductsDisplayCarouselItemHandler;
