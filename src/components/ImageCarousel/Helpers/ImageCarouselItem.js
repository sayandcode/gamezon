import RootDatabaseEntity from '../../../utlis/DBHandlers/DBDataConverter';
import {
  getboxArtFor,
  getScreenshotFor,
} from '../../../utlis/DBHandlers/DBFetch';

class ImageCarouselItem extends RootDatabaseEntity {
  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const [bgImgUrl, boxArtUrl] = await Promise.allSettledFiltered([
      getScreenshotFor(gameTitle),
      getboxArtFor(gameTitle),
    ]);

    return new this(doc, { bgImgUrl, boxArtUrl });
  }

  constructor(doc, { bgImgUrl, boxArtUrl }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.description =
      data.Description.match(/(.*?)\.\s/)?.[0] || data.Description;
    this.bgImgUrl = bgImgUrl;
    this.boxArtUrl = boxArtUrl;
  }

  dispose() {
    URL.revokeObjectURL(this.boxArtUrl);
    URL.revokeObjectURL(this.bgImgUrl);
  }
}

export default ImageCarouselItem;
