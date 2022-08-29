import Price from '../../../utlis/HelperClasses/Price';
import CheckoutOrderItem from './CheckoutOrderItem';

class CheckoutItemsHandler {
  static async createFor(cartItems) {
    const orderItems = await Promise.all(
      cartItems.map(async (cartItem) => CheckoutOrderItem.createFor(cartItem))
    );
    return new this(orderItems);
  }

  #items;

  constructor(orderItems) {
    // Things I need from each item
    // > Name
    // > Variant
    // > Count
    // > Price
    // Things I need from the overall cart
    // > Total Price
    this.#items = orderItems;
  }

  get items() {
    return this.#items;
  }

  get cartTotalPrice() {
    const totalPriceForEachItem = this.#items.map((item) => item.totalPrice);
    return totalPriceForEachItem.reduce((currTotal, thisPrice) =>
      Price.add(currTotal, thisPrice)
    );
  }
}

export default CheckoutItemsHandler;
