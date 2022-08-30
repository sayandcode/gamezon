class Price {
  static #checkTypes({ currency, value }) {
    if (typeof currency !== 'string')
      throw new Error('Currency should be a string');
    if (typeof value !== 'number') {
      throw new Error('Value should be a number');
    }
  }

  /* Adding prices is a vector operation, with associative nature. So we put it as a
  static method. This allows either of the operands to be undefined, allowing the function
  to behave like an identity function. */
  static add(firstPrice, secondPrice) {
    /* PATH1: Identity Fn: One of the prices is null/undefined  */
    if (!firstPrice || !secondPrice) {
      // return the one that is defined, as long as it is a price.
      const definedOperand = firstPrice || secondPrice;
      if (definedOperand instanceof this) return definedOperand;
      throw new Error('Only Price objects are allowed as operands');
    }
    // eslint-disable-next-line prettier/prettier
    /* PATH2: Invalid operands */
    else if (!(firstPrice instanceof this && secondPrice instanceof this))
      throw new Error('Only Price objects are allowed as operands');
    // eslint-disable-next-line prettier/prettier
    /* PATH3: Incompatible currencies */
    else if (firstPrice.currency !== secondPrice.currency)
      // You may add a currency converter here if the need arises
      throw new Error('Incompatible currencies');

    /* PATH4: Price addition */
    const currency = firstPrice.#currency; // can take currency from either, really.
    // const { currency } = firstPrice;
    const totalValue = firstPrice.#value + secondPrice.#value;
    const formattedValue = Number(totalValue.toFixed(2)); // to fix floating point errors
    return new this({ currency, value: formattedValue });
  }

  #currency;

  #value;

  constructor({ currency, value }) {
    Price.#checkTypes({ currency, value });
    this.#currency = currency;
    this.#value = value;
  }

  /* Multiply is a scalar operation, so we can have it on the object methods. */
  multiply(count) {
    const multipliedValue = this.#value * count;
    const multipliedValueFixedTo2Places = Number(
      multipliedValue.toFixed(2) // to fix floating point errors
    );
    return new this.constructor({
      currency: this.#currency,
      value: multipliedValueFixedTo2Places,
    });
  }

  print() {
    return `${this.#currency}${this.#value}`;
  }
}

export default Price;
