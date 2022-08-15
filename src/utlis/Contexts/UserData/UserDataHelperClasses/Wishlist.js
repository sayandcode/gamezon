import UserDataRoot from './UserDataRoot';

class Wishlist extends UserDataRoot {
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
    const productID = this.constructor.generateProductID(productName);
    return this.#contents[productID]; // no need to deep copy this one, as content of each item is just a string (productName)
  }

  toggle(productName) {
    const copy = this.clone();
    const productID = this.constructor.generateProductID(productName);

    // check if the product is added or not
    const existingEntry = copy.#contents[productID];
    // if it is, delete it, else add it
    if (existingEntry) delete copy.#contents[productID];
    else copy.#contents[productID] = productName;

    return copy;
  }
}

export default Wishlist;
