import { Timestamp } from 'firebase/firestore';
import { v4 as generateUuid } from 'uuid';
import Address from '../../Contexts/UserData/UserDataHelperClasses/AddressList/AddressClass';
import Cart from '../../Contexts/UserData/UserDataHelperClasses/Cart';
import { OrderDatabase } from '../DBManipulatorClasses';

class Order {
  #orderID;

  #items;

  #deliveryOptions;

  #timeStamp;

  static deserialize(serializedOrder) {
    const deserializedEntries = Object.entries(serializedOrder).map(
      ([key, value]) => [key, getDeserializerFor(key)(value)]
    );
    const deserializedOrderContents = Object.fromEntries(deserializedEntries);
    return new Order({ ...deserializedOrderContents });
  }

  serialize() {
    const order = {
      orderItems: this.#items,
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

  constructor({ orderItems, deliveryOptions, timeStamp, orderID }) {
    this.#items = orderItems;
    this.#deliveryOptions = deliveryOptions;
    this.#timeStamp = timeStamp || new Date();
    this.#orderID = orderID || generateUuid();
  }

  get id() {
    return this.#orderID;
  }

  get items() {
    // <Cart> will protect itself from mutation. We always have a reference to the original cart.
    // So we're safe from outside mutation
    return this.#items;
  }

  get deliveryOptions() {
    // <Address> will protect itself from mutation. We always have a reference to the original address.
    const { address, ...otherDeliveryOptions } = this.#deliveryOptions;

    // All of the other options(object keys) are either primitives, or objects themselves.
    // So they are cloned by `structuredClone`
    const otherDeliveryOptionsClone = structuredClone(otherDeliveryOptions);
    return { address, ...otherDeliveryOptionsClone };
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
    case 'deliveryOptions':
      return (deliveryOptions) => {
        const { address: serializedAddress, ...restDeliveryOptions } =
          deliveryOptions;
        const deliveryAddress = new Address(serializedAddress);

        return {
          address: deliveryAddress,
          ...restDeliveryOptions,
        };
      };
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
      return (orderItems) => {
        return orderItems.contents; // this serializes the cart
      };
    case 'deliveryOptions':
      return (deliveryOptions) => {
        const { address, ...otherDeliveryOptions } = deliveryOptions;
        const serializedAddress = address.content; // this serializes the address
        return {
          address: serializedAddress,
          otherDeliveryOptions,
        };
      };
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
