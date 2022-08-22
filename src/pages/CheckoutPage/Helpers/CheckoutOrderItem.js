import { GameDatabase } from '../../../utlis/DBHandlers/DBManipulatorClasses';
import Price from '../../../utlis/HelperClasses/Price';

class CheckoutOrderItem {
  static #extractPriceObjFor(variant, data) {
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
    const priceObj = this.#extractPriceObjFor(
      cartItem.variant,
      itemProductData
    );

    return new this({ ...cartItem, priceObj });
  }

  #name;

  #variant;

  #count;

  #price;

  #productID;

  constructor({ variant, productID, name, count, priceObj }) {
    this.#name = name;
    this.#variant = variant;
    this.#count = count;
    this.#price = new Price(priceObj);
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
