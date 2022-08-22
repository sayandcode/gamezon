import { GameDatabase } from '../../../utlis/DBHandlers/DBManipulatorClasses';

class CheckoutOrderItem {
  static #extractPriceFor(variant, data) {
    const requiredVariantData = data.variants.find(
      (thisVariant) => thisVariant.consoleName === variant
    );
    return requiredVariantData.price;
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
    const totalPriceVal = this.#count * this.#price.value;
    const totalPriceValFixedTo2 = Number(
      totalPriceVal.toFixed(2) // to fix floating point errors
    );
    return {
      currency: this.#price.currency,
      value: totalPriceValFixedTo2,
    };
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
