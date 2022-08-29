import OrdersMetadata from '../../../utlis/HelperClasses/Metadata/OrdersMetadata';
import CheckoutItemsHandler from './CheckoutItemsHandler';

class CheckoutPageDataHandler {
  static async getCheckoutItemsData(cart) {
    const cartItems = Object.values(cart.contents);
    return CheckoutItemsHandler.createFor(cartItems);
  }

  static async getOrdersMetadata() {
    const ordersMetadata = await OrdersMetadata.fetch();
    return ordersMetadata;
  }
}

export default CheckoutPageDataHandler;
