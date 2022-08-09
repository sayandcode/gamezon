import { v4 as generateUuid } from 'uuid';

class Address {
  #addressID;

  #content;

  constructor(addressObj, addressID) {
    this.#addressID = addressID || generateUuid();
    this.#content = JSON.parse(JSON.stringify(addressObj));
  }

  get id() {
    return this.#addressID;
  }

  get content() {
    return JSON.parse(JSON.stringify(this.#content));
  }
}

export default Address;
