import { Timestamp } from 'firebase/firestore';
import { v4 as generateUuid } from 'uuid';
import Address from '../Contexts/UserData/UserDataHelperClasses/AddressList/AddressClass';
import Cart from '../Contexts/UserData/UserDataHelperClasses/Cart';
import { OrderDatabase } from '../DBHandlers/DBManipulatorClasses';

class Order {
  #orderID;

  #cartOfOrderItems;

  #address;

  #deliveryOptions;

  #timeStamp;

  static deserialize(serializedOrder) {
    const deserializedEntries = Object.entries(serializedOrder).map(
      ([key, value]) => [key, getDeserializerFor(key)(value)]
    );
    const deserializedOrderContents = Object.fromEntries(deserializedEntries);
    return new this({ ...deserializedOrderContents });
  }

  serialize() {
    const order = {
      orderItems: this.#cartOfOrderItems,
      address: this.#address,
      deliveryOptions: this.#deliveryOptions,
      timeStamp: this.#timeStamp,
      orderID: this.#orderID,
    };
    const serializedEntries = Object.entries(order).map(([key, value]) => [
      key,
      getSerializerFor(key)(value),
    ]);
    return Object.fromEntries(serializedEntries);
  }

  constructor({ orderItems, address, deliveryOptions, timeStamp, orderID }) {
    this.#cartOfOrderItems = orderItems;
    this.#address = address;
    this.#deliveryOptions = deliveryOptions;
    this.#timeStamp = timeStamp || new Date();
    this.#orderID = orderID || generateUuid();
  }

  get id() {
    return this.#orderID;
  }

  get items() {
    // We always have a reference to the original cart. So we're safe from outside mutation
    // Additionally, cart.contents is returning a cloned obj, so free from mutation.
    return Object.values(this.#cartOfOrderItems.contents);
  }

  get address() {
    // <Address> will protect itself from mutation. We always have a reference to the original address.
    return this.#address;
  }

  get deliveryOptions() {
    // Delivery options are either primitives, or objects themselves.
    // So they are cloned by `structuredClone`
    return structuredClone(this.#deliveryOptions);
  }

  get timeStamp() {
    return this.#timeStamp;
  }

  async confirmFor(user) {
    // Confirming the order only sends the order info to the backend. The prices are set at the backend
    // and are hence free from user tampering
    const userID = user.uid;
    const orderID = this.id;
    const data = this.serialize();
    return OrderDatabase.set({ userID, orderID, data });
  }
}

function getDeserializerFor(key) {
  switch (key) {
    case 'orderItems':
      return (orderItems) => {
        return new Cart(orderItems);
      };
    case 'address':
      return (addressObj) => new Address(addressObj);
    case 'timeStamp':
      return (timeStamp) => {
        // This is firebase specific. Maybe you should consider redoing this, since it isn't actually deserializing.
        // Instead it is prepping for backend.
        return timeStamp.toDate();
      };
    default:
      // Anything else doesn't need to be deserialized
      return (x) => x;
  }
}

function getSerializerFor(key) {
  switch (key) {
    case 'orderItems':
      return (cartOfOrderItems) => {
        return cartOfOrderItems.contents; // this serializes the cart
      };
    case 'address':
      return (address) => address.content;
    case 'timeStamp':
      return (timeStamp) => {
        // This is firebase specific. Maybe you should consider redoing this, since it isn't actually serializing.
        // Instead it is prepping for backend.
        return Timestamp.fromDate(timeStamp);
      };
    default:
      // Anything else doesn't need to be serialized
      return (x) => x;
  }
}

export default Order;
