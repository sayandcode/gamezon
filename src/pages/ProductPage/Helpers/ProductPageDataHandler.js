import ProductPageMainItemHandler from './ProductPageMainItemHandler';

/* This class is intentionally left kind of empty, as it is intended to be
a wrapper class. In the current version of the website, only the product
details for that specific product is needed in the product page.
As the page grows, we will need to handle more (non-related) data, to 
be displayed on this page. Hence, containing the productData inside #product, 
and handling it using a separate class, is an act of foresight on our part */
class ProductPageDataHandler {
  static async createFor(productName) {
    const pageProduct = await ProductPageMainItemHandler.createFor(productName);
    return new this(pageProduct);
  }

  #pageProduct;

  constructor(pageProduct) {
    this.#pageProduct = pageProduct;
  }

  get product() {
    return this.#pageProduct;
  }

  dispose() {
    this.#pageProduct.dispose();
  }
}

export default ProductPageDataHandler;
