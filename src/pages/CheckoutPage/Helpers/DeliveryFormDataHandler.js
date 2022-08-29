import Price from '../../../utlis/HelperClasses/Price';

class DeliveryFormDataHandler {
  #checkoutItemsData;

  #ordersMetadata;

  constructor(checkoutItemsData, ordersMetadata) {
    this.#checkoutItemsData = checkoutItemsData;
    this.#ordersMetadata = ordersMetadata;
  }

  get allDeliveryOptions() {
    return this.#ordersMetadata.allDeliveryOptions;
  }

  get defaultDeliveryOptions() {
    const defaultDeliveryOptions = {};
    Object.values(this.allDeliveryOptions).forEach((option) => {
      defaultDeliveryOptions[option.name] = option.defaultValue;
    });
    return defaultDeliveryOptions;
  }

  get initialFormValues() {
    const initialFormValues = {
      address: null,
      ...this.defaultDeliveryOptions,
    };
    return initialFormValues;
  }

  orderTotalPrice(formValues) {
    return Object.values(this.allDeliveryOptions).reduce(
      conditionallyAddToTotal,
      this.#checkoutItemsData.cartTotalPrice
    );

    function conditionallyAddToTotal(currTotal, option) {
      // if the option is selected in the form, add its price to total
      return formValues[option.name]
        ? Price.add(option.price, currTotal)
        : currTotal;
    }
  }
}
export default DeliveryFormDataHandler;
