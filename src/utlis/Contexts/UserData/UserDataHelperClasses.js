/* The classes act like pure functions, and return a new instance each time */
/* This helps us to use the new instance in react useState, which recognizes  */
/* only new objects, not internal changes to old objects */

class UserDataRoot {
  clone() {
    return new this.constructor(this.contents);
  }

  get isEmpty() {
    return !Object.keys(this.contents).length;
  }
}

export class Cart extends UserDataRoot {
  #contents;

  constructor(items = {}) {
    super();
    this.#contents = { ...items };
  }

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
    const productID = new URLSearchParams({ productName, variant }).toString();
    const requiredItem = this.#contents[productID];
    return requiredItem ? JSON.parse(JSON.stringify(requiredItem)) : undefined;
  }

  add(productName, variant, { count: additionalCount = 1 } = {}) {
    if (!variant)
      throw new Error('Need to specify variant before adding to Cart');

    const copy = this.clone();
    const productID = new URLSearchParams({ productName, variant }).toString();

    // if item is in cart, increment count
    const oldContents = copy.#contents;
    const oldCount = oldContents[productID]?.count;
    const newCount = oldCount ? oldCount + additionalCount : additionalCount;

    const updatedContents = {
      ...oldContents,
      [productID]: { name: productName, count: newCount, variant },
    };
    copy.#contents = updatedContents;

    return copy;
  }

  remove(productName, variant, { all = false } = {}) {
    if (!variant)
      throw new Error('Need to specify variant before removing from Cart');

    const copy = this.clone();
    const productID = new URLSearchParams({ productName, variant }).toString();

    // check if the product is added or not
    const existingEntry = copy.#contents[productID];
    if (!existingEntry) {
      console.error(
        `Item (${productName}) not added to cart. Hence cannot remove it.`
      );
      return copy;
    }

    const oldCount = existingEntry.count;
    const newCount = all ? 0 : oldCount - 1;

    if (newCount === 0) delete copy.#contents[productID];
    else copy.#contents[productID].count = newCount;

    return copy;
  }
}

export class Wishlist extends UserDataRoot {
  #contents;

  constructor(items = {}) {
    super();
    this.#contents = { ...items };
  }

  get contents() {
    return JSON.parse(JSON.stringify(this.#contents));
  }

  get count() {
    return Object.keys(this.#contents).length;
  }

  find(productName) {
    const productID = new URLSearchParams({ productName }).toString();
    return this.#contents[productID]; // no need to deep copy this one, as content of each item is just a string (productName)
  }

  toggle(productName) {
    const copy = this.clone();
    const productID = new URLSearchParams({ productName }).toString();

    // check if the product is added or not
    const existingEntry = copy.#contents[productID];
    // if it is, delete it, else add it
    if (existingEntry) delete copy.#contents[productID];
    else copy.#contents[productID] = productName;

    return copy;
  }
}
