import { getboxArtFor } from '../../../../../utlis/DBHandlers/MockDBFetch';

class SearchOptionDataHandler {
  #imgUrl;

  async getImgUrl(option) {
    const productName = option.title;
    this.#imgUrl = await getboxArtFor(productName);
    return this.#imgUrl;
  }

  dispose() {
    URL.revokeObjectURL(this.#imgUrl);
  }
}

export default SearchOptionDataHandler;
