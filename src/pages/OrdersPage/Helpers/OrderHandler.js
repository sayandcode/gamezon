import { format as formatDate } from 'date-fns';
import RootDatabaseEntity from '../../../utlis/DBHandlers/DBDataConverter';
import { getboxArtFor } from '../../../utlis/DBHandlers/DBFetch';
import Order from '../../../utlis/HelperClasses/OrderClass';
import OrdersMetadata from '../../../utlis/HelperClasses/Metadata/OrdersMetadata';
import Price from '../../../utlis/HelperClasses/Price';
import OrdersPageOrderItemHandler from './OrdersPageOrderItemHandler';

class OrderHandler extends RootDatabaseEntity {
  static #metadata;

  static async #ensureMetadataPresent() {
    // If the metadata exists, its all good
    if (this.#metadata) return;
    // Otherwise fetch and set it
    this.#metadata = await OrdersMetadata.fetch();
  }

  static async #getOrderItemHandlers(order) {
    /* Ideally we would not need OrderItemHandlers, as all the orderItem related
    data like prices would be included in the actual order document, using
    something like a firebase cloud function. 
    But since those are not free, we have to resort to fetching the actual data from
    the current database state. This will yield incorrect prices, if the prices fluctuate;
    but it is better than setting the price from the client, which is prone to tampering. */
    return Promise.all(
      order.items.map((item) => OrdersPageOrderItemHandler.createFor(item))
    );
  }

  static async #getDisplayPic(order) {
    const firstItemName = order.items[0].name;
    const firstItemBoxArt = await getboxArtFor(firstItemName);
    return firstItemBoxArt;
  }

  static async createFor(doc) {
    const order = Order.deserialize(doc.data);

    /* metadata request doesn't return any value,
    so only first two items of array are destructured */
    const [displayPic, orderItemHandlers] = await Promise.all([
      this.#getDisplayPic(order),
      this.#getOrderItemHandlers(order),
      /* This makes sure that metadata is present before the handlers are made.
      But at the same time, it improves performance since all network requests
      are simultaneous */
      this.#ensureMetadataPresent(),
    ]);
    return new this(doc, orderItemHandlers, displayPic);
  }

  #rootOrder;

  #orderItemHandlers;

  #displayPic;

  constructor(doc, orderItems, displayPic) {
    super(doc);
    this.#rootOrder = Order.deserialize(doc.data);
    this.#orderItemHandlers = orderItems;
    this.#displayPic = displayPic;
  }

  get id() {
    return this.#rootOrder.id;
  }

  get items() {
    return this.#orderItemHandlers;
  }

  get displayPic() {
    return this.#displayPic;
  }

  get #costOfProducts() {
    const priceOfEachOrderItem = this.#orderItemHandlers.map(
      (item) => item.totalPrice
    );
    const costOfProducts = priceOfEachOrderItem.reduce((total, currPrice) =>
      Price.add(total, currPrice)
    );
    return costOfProducts;
  }

  get #costOfDelivery() {
    const priceOfSelectedDeliveryOptions = this.selectedDeliveryOptions.map(
      (option) => option.price
    );
    const costOfDelivery = priceOfSelectedDeliveryOptions.reduce(
      (total, currPrice) => Price.add(total, currPrice)
    );
    return costOfDelivery;
  }

  get totalPrice() {
    return Price.add(this.#costOfProducts, this.#costOfDelivery);
  }

  get date() {
    const date = this.#rootOrder.timeStamp;
    const formattedDate = formatDate(date, 'PPpp');
    return formattedDate;
  }

  get address() {
    return this.#rootOrder.address;
  }

  get selectedDeliveryOptions() {
    const { allDeliveryOptions } = this.constructor.#metadata;
    return Object.entries(this.#rootOrder.deliveryOptions)
      .filter(([, optionIsSelected]) => optionIsSelected)
      .map(([optionName]) => allDeliveryOptions[optionName]);
  }

  dispose() {
    URL.revokeObjectURL(this.#displayPic);
  }
}

export default OrderHandler;
