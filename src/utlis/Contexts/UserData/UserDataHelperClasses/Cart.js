import UserDataRoot from './UserDataRoot';

class Cart extends UserDataRoot {
  #contents;

  // This doubles as a deserializer function.
  constructor(items = {}) {
    super();
    this.#contents = { ...items };
  }

  // This doubles as a serializer function
  get contents() {
    return JSON.parse(JSON.stringify(this.#contents));
  }

  get count() {
    return Object.values(this.#contents).reduce(
      (sum, currItem) => sum + currItem.count,
      0
    );
  }

  find(productName, variant) {
    const productID = this.constructor.generateProductID(productName, variant);
    const requiredItem = this.#contents[productID];
    return requiredItem ? JSON.parse(JSON.stringify(requiredItem)) : undefined;
  }

  add(productName, variant, { count: additionalCount = 1 } = {}) {
    if (!variant)
      throw new Error('Need to specify variant before adding to Cart');

    const copy = this.clone();
    const productID = this.constructor.generateProductID(productName, variant);

    // if item is in cart, increment count
    const oldContents = copy.#contents;
    const oldCount = oldContents[productID]?.count;
    const newCount = oldCount ? oldCount + additionalCount : additionalCount;

    const updatedContents = {
      ...oldContents,
      [productID]: { variant, productID, name: productName, count: newCount },
    };
    copy.#contents = updatedContents;

    return copy;
  }

  remove(productName, variant, { all = false } = {}) {
    // This check is necessary as generateProductID will work with variant = undefined.
    // But that would not satisfy our business logic.
    if (!variant)
      throw new Error('Need to specify variant before removing from Cart');

    const copy = this.clone();
    const productID = this.constructor.generateProductID(productName, variant);

    // check if the product is added or not
    const existingEntry = copy.#contents[productID];
    if (!existingEntry)
      throw new Error(
        `Item (${productName}) not added to cart. Hence cannot remove it.`
      );

    const oldCount = existingEntry.count;
    const newCount = all ? 0 : oldCount - 1;

    if (newCount === 0) delete copy.#contents[productID];
    else copy.#contents[productID].count = newCount;

    return copy;
  }

  empty() {
    return new this.constructor();
  }
}

export default Cart;
