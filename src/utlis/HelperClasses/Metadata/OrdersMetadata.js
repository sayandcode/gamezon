import { MetadataDatabase } from '../../DBHandlers/DBManipulatorClasses';
import Price from '../Price';

class OrdersMetadata {
  static async fetch() {
    const metadataDoc = await MetadataDatabase.get({ for: 'orders' });
    const serializedMetadata = metadataDoc.data;
    return new this(serializedMetadata);
  }

  #serializedMetadata;

  constructor(serializedMetadata) {
    this.#serializedMetadata = serializedMetadata;
  }

  /* Since this is a nested object, calculating and providing a new object for
  each access, prevents mutation from the client side. This is better since the alternative
  of cloning for each nested object is very cumbersome. */
  get allDeliveryOptions() {
    const serializedOptions = this.#serializedMetadata.allDeliveryOptions;
    const deserializedOptions = {};
    Object.values(serializedOptions).forEach((option) => {
      // All we need to deserialize is the price.
      const priceObj = option.price;
      const deserializedPrice = priceObj ? new Price(priceObj) : priceObj;

      // The rest are already serialized
      deserializedOptions[option.name] = {
        ...option,
        price: deserializedPrice,
      };
    });
    return deserializedOptions;
  }
}

export default OrdersMetadata;
