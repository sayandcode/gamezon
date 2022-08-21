import CheckoutOrderItem from './CheckoutOrderItem';

class CheckoutDataHandler {
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
    return totalPriceForEachItem.reduce((total, thisPrice) =>
      addPrices(total, thisPrice)
    );
  }
}

function addPrices(firstPrice, secondPrice) {
  // If either prices are not null/undefined, return the one that is defined.
  if (!firstPrice || !secondPrice) return firstPrice || secondPrice;
  // You may add a currency converter here if the need arises
  if (firstPrice.currency !== secondPrice.currency)
    throw new Error('Incompatible currencies');

  const { currency } = firstPrice;
  const totalValue = firstPrice.value + secondPrice.value;
  const formattedValue = Number(totalValue.toFixed(2)); // to fix floating point errors

  return { currency, value: formattedValue };
}

export { CheckoutDataHandler, addPrices };
