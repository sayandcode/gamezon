/* The classes act like pure functions, and return a new instance each time */
/* This helps us to use the new instance in react useState, which recognizes  */
/* only new objects, not internal changes to old objects */

import getUuidFromString from 'uuid-by-string';
import Address from '../../../components/Address/addressClass';

class UserDataRoot {
  clone() {
    return new this.constructor(this.contents);
  }

  get isEmpty() {
    return !Object.keys(this.contents).length;
  }
}

function generateProductID(productName, variant = '') {
  // the toString function ensures that the arguments are present, and valid strings
  return getUuidFromString(productName.toString() + variant.toString());
}

class Cart extends UserDataRoot {
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
    const productID = generateProductID(productName, variant);
    const requiredItem = this.#contents[productID];
    return requiredItem ? JSON.parse(JSON.stringify(requiredItem)) : undefined;
  }

  add(productName, variant, { count: additionalCount = 1 } = {}) {
    if (!variant)
      throw new Error('Need to specify variant before adding to Cart');

    const copy = this.clone();
    const productID = generateProductID(productName, variant);

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
    // This check is necessary as generateProductID will work with variant = undefined.
    // But that would not satisfy our business logic.
    if (!variant)
      throw new Error('Need to specify variant before removing from Cart');

    const copy = this.clone();
    const productID = generateProductID(productName, variant);

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
}

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
    const productID = generateProductID(productName);
    return this.#contents[productID]; // no need to deep copy this one, as content of each item is just a string (productName)
  }

  toggle(productName) {
    const copy = this.clone();
    const productID = generateProductID(productName);

    // check if the product is added or not
    const existingEntry = copy.#contents[productID];
    // if it is, delete it, else add it
    if (existingEntry) delete copy.#contents[productID];
    else copy.#contents[productID] = productName;

    return copy;
  }
}

class AddressList extends UserDataRoot {
  #contents;

  static createFromObject(addressItemsObj = {}) {
    const addressItemEntries = Object.entries(addressItemsObj);
    const addressListEntries = addressItemEntries.map(
      convertAddressItemEntryToAddressEntry
    );
    const newAddressListContents = Object.fromEntries(addressListEntries);

    return new AddressList(newAddressListContents);

    function convertAddressItemEntryToAddressEntry([addressID, addressItem]) {
      const newAddress = new Address(addressItem, addressID);
      return [newAddress.id, newAddress];
    }
  }

  constructor(items = {}) {
    super();
    this.#contents = { ...items };
  }

  get contents() {
    // We need to provide the contents, which is an object of <Address> instances.
    // But at the same time, we cannot let the user mutate the #contents obj, with his actions.
    // So, we create a new object, which contains the same <Address> instances.
    // This acheives two things:
    // 1. The user gets to play around with the contents, while making sure that our internal store of objects is unmutated
    // 2. The <Address> instance itself can't be mutated, since all the data in it, is private.
    // So the worst the user can do is lose a reference to the <Address> instance, which does not affect the business logic.
    return Object.fromEntries(Object.entries(this.#contents));
  }

  get objectifiedContents() {
    // This function is mainly used for updating the DB, which don't support classes.(<Address>)
    const entries = Object.entries(this.#contents);
    const objectifiedEntries = entries.map(([addressID, address]) => [
      addressID,
      address.content,
    ]);
    const objectifiedContents = Object.fromEntries(objectifiedEntries);

    return objectifiedContents;
  }

  add(address) {
    const copy = this.clone();
    copy.#contents[address.id] = address;
    return copy;
  }

  remove(address) {
    // Check if entry exists
    const existingEntry = this.#contents[address.id];
    if (!existingEntry)
      throw new Error("Can't remove address that wasn't added");

    // Then delete it from the new address list
    const copy = this.clone();
    delete copy.#contents[address.id];
    return copy;
  }

  edit(oldAddress, newAddress) {
    return this.remove(oldAddress).add(newAddress);
  }
}

export { generateProductID, Cart, Wishlist, AddressList };
