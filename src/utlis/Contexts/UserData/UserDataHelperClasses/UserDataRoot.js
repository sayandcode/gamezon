import getUuidFromString from 'uuid-by-string';

class UserDataRoot {
  clone() {
    return new this.constructor(this.contents);
  }

  get isEmpty() {
    return !Object.keys(this.contents).length;
  }

  static generateProductID(productName, variant = '') {
    // the toString function ensures that the arguments are present, and valid strings
    return getUuidFromString(productName.toString() + variant.toString());
  }
}

export default UserDataRoot;
