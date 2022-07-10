import { getboxArtFor, getScreenshotFor } from './MockDBFetch'; // BEFORE PRODUCTION: change 'MockDBFetch' to 'DBFetch' for production

class RootDatabaseEntity {
  #ref;

  constructor(doc) {
    this.#ref = doc.ref;
  }

  getRef() {
    return this.#ref;
  }
}

export class ImageCarouselItem extends RootDatabaseEntity {
  constructor(doc, { bgImgUrl, boxArtUrl }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.description =
      data.Description.match(/(.*?)\.\s/)?.[0] || data.Description;
    this.bgImgUrl = bgImgUrl;
    this.boxArtUrl = boxArtUrl;
  }

  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const [bgImgUrl, boxArtUrl] = await Promise.allSettledFiltered([
      getScreenshotFor(gameTitle),
      getboxArtFor(gameTitle),
    ]);

    return new ImageCarouselItem(doc, { bgImgUrl, boxArtUrl });
  }
}

export class ProductsDisplayCarouselItem extends RootDatabaseEntity {
  constructor(doc, { boxArtUrl }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.price = data.startingPrice;
    this.boxArtUrl = boxArtUrl;
  }

  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const boxArtUrl = await getboxArtFor(gameTitle);

    return new ProductsDisplayCarouselItem(doc, { boxArtUrl });
  }
}
