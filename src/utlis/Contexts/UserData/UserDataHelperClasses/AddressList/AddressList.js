import Address from './AddressClass';
import UserDataRoot from '../UserDataRoot';

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

  #confirmPreExisting(address) {
    // Check if entry exists
    const existingEntry = this.#contents[address.id];
    if (!existingEntry)
      throw new Error("Can't remove address that wasn't added");
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
    this.#confirmPreExisting(address);

    // Then delete it from the new address list
    const copy = this.clone();
    delete copy.#contents[address.id];
    return copy;
  }

  edit(oldAddress, newAddress) {
    this.#confirmPreExisting(oldAddress);
    const origID = oldAddress.id;
    const copy = this.clone();
    copy.#contents[origID] = new Address(newAddress.content, origID);
    return copy;
  }

  find(addressID) {
    // dont need to copy this, as we are providing an <Address> instance. It can protect itself from mutation
    return this.#contents[addressID];
  }
}

export default AddressList;
