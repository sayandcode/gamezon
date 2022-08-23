import { getScreenshotFor } from './MockDBFetch'; // BEFORE PRODUCTION: change 'MockDBFetch' to 'DBFetch' for production

class RootDatabaseEntity {
  #ref;

  constructor(doc) {
    this.#ref = doc.ref;
  }

  getRef() {
    return this.#ref;
  }
}

export class ProductPageItem extends RootDatabaseEntity {
  constructor(doc, { screenshotUrls }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.genres = data['Genre(s)'];

    const variantsEntries = data.variants.map((variant) => {
      const key = variant.consoleName;
      const val = {
        price:
          variant.price === null
            ? null
            : variant.price.currency + variant.price.value.toFixed(2),
        purchaseUrl: variant.purchaseUrl,
      };
      return [key, val];
    });
    this.variants = Object.fromEntries(variantsEntries);
    this.description = data.Description;
    this.imgUrls = screenshotUrls;
    this.trailerUrl = data.trailerURL;
  }

  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const screenshotUrls = await getScreenshotFor(gameTitle, { count: 4 });
    return new ProductPageItem(doc, { screenshotUrls });
  }

  dispose() {
    this.imgUrls.forEach((url) => URL.revokeObjectURL(url));
  }
}

export default RootDatabaseEntity;
