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
    return { ...this.#contents };
  }

  add(productName, { count: additionalCount = 1 }) {
    const copy = this.clone();
    const productID = encodeURIComponent(productName);

    // if item is in cart, increment count
    const oldContents = copy.#contents;
    const oldCount = oldContents[productID]?.count;
    const newCount = oldCount ? oldCount + additionalCount : additionalCount;

    const updatedContents = {
      ...oldContents,
      [productID]: { name: productName, count: newCount },
    };
    copy.#contents = updatedContents;

    return copy;
  }

  remove(productName, { all = false }) {
    const copy = this.clone();
    const productID = encodeURIComponent(productName);

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
    return { ...this.#contents };
  }

  toggle(productName) {
    const copy = this.clone();
    const productID = encodeURIComponent(productName);

    // check if the product is added or not
    const existingEntry = copy.#contents[productID];
    // if it is, delete it, else add it
    if (existingEntry) delete copy.#contents[productID];
    else copy.#contents[productID] = true;

    return copy;
  }
}
