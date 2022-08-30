import { GameDatabase } from '../../../utlis/DBHandlers/DBManipulatorClasses';
import Price from '../../../utlis/HelperClasses/Price';

class CheckoutOrderItem {
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

  /* createFor fetches the required doc from the database, and extracts the required data from the doc
  to form the OrderItem */
  static async createFor(cartItem) {
    const itemProductDataDoc = await GameDatabase.get({ title: cartItem.name });
    const itemProductData = itemProductDataDoc.data;
    const price = this.#extractPriceFor(cartItem.variant, itemProductData);

    return new this({ ...cartItem, price });
  }

  #name;

  #variant;

  #count;

  #price;

  #productID;

  constructor({ variant, productID, name, count, price }) {
    this.#name = name;
    this.#variant = variant;
    this.#count = count;
    this.#price = price;
    this.#productID = productID;
  }

  get totalPrice() {
    return this.#price.multiply(this.#count);
  }

  get name() {
    return this.#name;
  }

  get variant() {
    return this.#variant;
  }

  get count() {
    return this.#count;
  }

  get price() {
    return this.#price;
  }

  get productID() {
    return this.#productID;
  }
}

export default CheckoutOrderItem;
