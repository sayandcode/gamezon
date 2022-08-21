class CartPageItemHandler {
  static async createFor(cartItem, { productDataCache }) {
    const productData = await productDataCache.get({
      productName: cartItem.name,
      getBoxArt: true,
    });
    return new this(cartItem, productData);
  }

  #title;

  #productID;

  #count;

  #variant;

  #price;

  #boxArtUrl;

  constructor(itemCartData, itemProductData) {
    this.#title = itemCartData.name;
    this.#productID = itemCartData.productID;
    this.#variant = itemCartData.variant;
    this.#count = itemCartData.count;

    const itemDocData = itemProductData.doc.data;
    const allVariantsDetails = itemDocData.variants;
    const requiredVariantDetails = allVariantsDetails.find(
      (variant) => variant.consoleName === itemCartData.variant
    );
    this.#price = requiredVariantDetails.price;
    this.#boxArtUrl = itemProductData.boxArtUrl;
  }

  get title() {
    return this.#title;
  }

  get productID() {
    return this.#productID;
  }

  get count() {
    return this.#count;
  }

  get variant() {
    return this.#variant;
  }

  get price() {
    return this.#price;
  }

  get boxArtUrl() {
    return this.#boxArtUrl;
  }

  get totalPrice() {
    const totalPriceVal = this.#count * this.#price.value;
    const totalPriceValFixedTo2 = Number(
      totalPriceVal.toFixed(2) // to fix floating point errors
    );
    return {
      currency: this.#price.currency,
      value: totalPriceValFixedTo2,
    };
  }
}
export default CartPageItemHandler;
