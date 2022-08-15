import { GameDatabase } from '../../utlis/DBHandlers/DBManipulatorClasses';

class CheckoutDataHandler {
  static async prepareFor(cartItems) {
    const cartItemsWithData = await Promise.all(
      cartItems.map(getCheckoutDataForCartItem)
    );
    return new CheckoutDataHandler(cartItemsWithData);

    async function getCheckoutDataForCartItem(itemCartData) {
      const doc = await GameDatabase.get({ title: itemCartData.name });
      return { itemCartData, itemProductData: doc.data };
    }
  }

  constructor(cartItemsWithData) {
    // Things I need from each item
    // > Name
    // > Variant
    // > Count
    // > Price
    // Things I need from the overall cart
    // > Total Price
    this.items = cartItemsWithData.map(extractCheckoutItems);
    this.cartTotalPrice = findCartTotalPrice(this.items);

    function extractCheckoutItems({ itemProductData, itemCartData }) {
      const { productID, variant, count, name } = itemCartData;
      // Extract Price from the required variant in itemProductData
      const price = extractPriceFor(variant, itemProductData);
      const totalPrice = findItemTotalPrice(price, count);

      return { name, variant, count, price, totalPrice, productID };

      function extractPriceFor(_variant, _data) {
        const requiredVariantData = _data.variants.find(
          (thisVariant) => thisVariant.consoleName === _variant
        );
        return requiredVariantData.price;
      }

      function findItemTotalPrice(_price, _count) {
        const unprocessedTotalPriceValue = _count * _price.value;
        const processedTotalPriceValue = Number(
          unprocessedTotalPriceValue.toFixed(2) // to fix floating point errors
        );
        return {
          currency: _price.currency,
          value: processedTotalPriceValue,
        };
      }
    }

    function findCartTotalPrice(allItems) {
      const totalPriceForEachItem = allItems.map((item) => item.totalPrice);
      return totalPriceForEachItem.reduce((total, thisPrice) =>
        addPrices(total, thisPrice)
      );

      function addPrices(firstPrice, secondPrice) {
        // You may add a currency converter here if the need arises
        if (firstPrice.currency !== secondPrice.currency)
          throw new Error('Incompatible currencies');
        const { currency } = firstPrice;

        const totalValue = firstPrice.value + secondPrice.value;
        const formattedValue = Number(totalValue.toFixed(2)); // to fix floating point errors

        return { currency, value: formattedValue };
      }
    }
  }
}

const defaultDeliveryOptions = {
  giftWrap: false,
  oneDayShipping: false,
  address: null,
};

async function confirmOrder(cart, deliveryOptions) {
  // Things I need to pass to backend:
  // 1. Cart
  // 2. Delivery Options(Address, giftWrap, 1-day vs standard shipping)
  /* TODO: ADD THIS DATA TO USERDATA */
  console.log({ cart, deliveryOptions });
}
// eslint-disable-next-line import/prefer-default-export
export { CheckoutDataHandler, defaultDeliveryOptions, confirmOrder };
