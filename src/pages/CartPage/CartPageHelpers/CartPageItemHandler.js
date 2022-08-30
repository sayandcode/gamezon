import Price from '../../../utlis/HelperClasses/Price';

class CartPageItemHandler {
  static #extractPriceFor(requiredVariantConsoleName, itemDocData) {
    const { variants: allVariantsDetails, discount: discountFraction } =
      itemDocData;
    const requiredVariantDetails = allVariantsDetails.find(
      (variant) => variant.consoleName === requiredVariantConsoleName
    );

    // We dont need to check for null case since all items in cart must have price
    const variantPrice = new Price(requiredVariantDetails.price);
    if (discountFraction) return variantPrice.multiply(1 - discountFraction);
    return variantPrice;
  }

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
    this.#price = this.constructor.#extractPriceFor(this.#variant, itemDocData);
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
    return this.#price.multiply(this.#count);
  }
}
export default CartPageItemHandler;
