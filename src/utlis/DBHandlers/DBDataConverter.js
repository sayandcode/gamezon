import { getboxArtFor, getScreenshotFor } from './MockDBFetch'; // BEFORE PRODUCTION: change '/MockDBFetch' to '/DBFetch' for production

export class ImageCarouselItem {
  constructor(data) {
    this.title = data.Title;
    this.description =
      data.Description.match(/(.*?)\.\s/)?.[0] || data.Description;
    this.bgImgUrl = data.bgImgUrl;
    this.boxArtUrl = data.boxArtUrl;
  }

  static async createFrom(data) {
    const gameTitle = data.Title;
    const [bgImgUrl, boxArtUrl] = await Promise.allSettledFiltered([
      getScreenshotFor(gameTitle),
      getboxArtFor(gameTitle),
    ]);

    return new ImageCarouselItem({ ...data, bgImgUrl, boxArtUrl });
  }
}

export class ProductsDisplayCarouselItem {
  constructor(data) {
    this.title = data.Title;
    this.price = data.Price;
    this.boxArtUrl = data.boxArtUrl;
  }

  static async createFrom(data) {
    const gameTitle = data.Title;
    const boxArtUrl = await getboxArtFor(gameTitle);

    return new ProductsDisplayCarouselItem({ ...data, boxArtUrl });
  }
}
