import RootDatabaseEntity from '../../../utlis/DBHandlers/DBDataConverter';
import { GameDatabase } from '../../../utlis/DBHandlers/DBManipulatorClasses';
import { getScreenshotFor } from '../../../utlis/DBHandlers/DBFetch';
import Price from '../../../utlis/HelperClasses/Price';

class ProductPageMainItemHandler extends RootDatabaseEntity {
  static #extractVariantsFromObj(variantsObj) {
    return Object.fromEntries(
      variantsObj.map((variant) => {
        const key = variant.consoleName;
        const val = {
          price: variant.price === null ? null : new Price(variant.price),
          purchaseUrl: variant.purchaseUrl,
        };
        return [key, val];
      })
    );
  }

  static async createFor(productName) {
    const doc = await GameDatabase.get({ title: productName });
    const screenshotUrls = await getScreenshotFor(productName, { count: 4 });
    return new this({ doc, screenshotUrls });
  }

  #title;

  #genres;

  #variants;

  #discountFraction;

  #description;

  #imgUrls;

  #trailerUrl;

  constructor({ doc, screenshotUrls }) {
    super(doc);
    const {
      Title,
      'Genre(s)': genres,
      variants: variantsObj,
      discount: discountFraction,
      Description,
      trailerURL,
    } = doc.data;

    this.#title = Title;
    this.#genres = genres;
    this.#variants = this.constructor.#extractVariantsFromObj(variantsObj);
    this.#discountFraction = discountFraction;
    this.#description = Description;
    this.#imgUrls = screenshotUrls;
    this.#trailerUrl = trailerURL;
  }

  /* 👇 PUBLIC METHODS 👇 */

  get title() {
    return this.#title;
  }

  get genres() {
    return this.#genres;
  }

  get variants() {
    return this.#variants;
  }

  get discountFraction() {
    return this.#discountFraction;
  }

  get description() {
    return this.#description;
  }

  get imgUrls() {
    return this.#imgUrls;
  }

  get trailerUrl() {
    return this.#trailerUrl;
  }

  dispose() {
    this.#imgUrls.forEach((url) => URL.revokeObjectURL(url));
  }
}

export default ProductPageMainItemHandler;
