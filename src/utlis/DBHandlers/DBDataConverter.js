import {
  AddressList,
  Cart,
  Wishlist,
} from '../Contexts/UserData/UserDataHelperClasses';
import { getboxArtFor, getScreenshotFor } from './MockDBFetch'; // BEFORE PRODUCTION: change 'MockDBFetch' to 'DBFetch' for production

class RootDatabaseEntity {
  #ref;

  constructor(doc) {
    this.#ref = doc.ref;
  }

  getRef() {
    return this.#ref;
  }
}

export class ImageCarouselItem extends RootDatabaseEntity {
  constructor(doc, { bgImgUrl, boxArtUrl }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.description =
      data.Description.match(/(.*?)\.\s/)?.[0] || data.Description;
    this.bgImgUrl = bgImgUrl;
    this.boxArtUrl = boxArtUrl;
  }

  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const [bgImgUrl, boxArtUrl] = await Promise.allSettledFiltered([
      getScreenshotFor(gameTitle),
      getboxArtFor(gameTitle),
    ]);

    return new ImageCarouselItem(doc, { bgImgUrl, boxArtUrl });
  }

  dispose() {
    URL.revokeObjectURL(this.boxArtUrl);
    URL.revokeObjectURL(this.bgImgUrl);
  }
}

export class ProductsDisplayCarouselItem extends RootDatabaseEntity {
  constructor(doc, { boxArtUrl }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;

    this.price = `${
      data.startingPrice.currency
    }${data.startingPrice.value.toFixed(2)}`;
    const discountFraction = data.discount;

    if (discountFraction) {
      const discountedPriceVal = (
        data.startingPrice.value *
        (1 - discountFraction)
      ).toFixed(2);
      this.discount = {
        percent: (discountFraction * 100).toFixed(0),
        price: `${data.startingPrice.currency}${discountedPriceVal}`,
      };
    }
    this.boxArtUrl = boxArtUrl;
    this.variant = data.variants[0].consoleName;
  }

  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const boxArtUrl = await getboxArtFor(gameTitle);

    return new ProductsDisplayCarouselItem(doc, { boxArtUrl });
  }

  dispose() {
    URL.revokeObjectURL(this.boxArtUrl);
  }
}

export class ProductPageItem extends RootDatabaseEntity {
  constructor(doc, { screenshotUrls }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.genres = data['Genre(s)'];

    const variantsEntries = data.variants.map((variant) => {
      const key = variant.consoleName;
      const val = {
        price:
          variant.price === null
            ? null
            : variant.price.currency + variant.price.value.toFixed(2),
        purchaseUrl: variant.purchaseUrl,
      };
      return [key, val];
    });
    this.variants = Object.fromEntries(variantsEntries);
    this.description = data.Description;
    this.imgUrls = screenshotUrls;
    this.trailerUrl = data.trailerURL;
  }

  static async createFrom(doc) {
    const gameTitle = doc.data.Title;
    const screenshotUrls = await getScreenshotFor(gameTitle, { count: 4 });
    return new ProductPageItem(doc, { screenshotUrls });
  }

  dispose() {
    this.imgUrls.forEach((url) => URL.revokeObjectURL(url));
  }
}

export class UserDataHandler extends RootDatabaseEntity {
  constructor(doc) {
    super(doc);
    const { data } = doc;
    this.cartItems = data.cartItems;
    this.wishlistItems = data.wishlistItems;
    this.addressListItems = data.addressListItems;
  }

  toLocalState() {
    return {
      // if the field doesn't exist, it defaults to the empty initialization of the class. So it works anyway
      cart: new Cart(this.cartItems),
      wishlist: new Wishlist(this.wishlistItems),
      addressList: AddressList.createFromObject(this.addressListItems),
    };
  }

  static toDBForm(localData) {
    const [cart, wishlist, addressList] = [
      localData.cart,
      localData.wishlist,
      localData.addressList,
    ];

    // if a field is empty, delete the field
    const cartItems = cart.isEmpty ? undefined : cart.contents;
    const wishlistItems = wishlist.isEmpty ? undefined : wishlist.contents;
    const addressListItems = addressList.isEmpty
      ? undefined
      : addressList.objectifiedContents;

    return {
      ...(cartItems && { cartItems }),
      ...(wishlistItems && { wishlistItems }),
      ...(addressListItems && { addressListItems }),
    };
  }
}

export class CartItemDataHandler extends RootDatabaseEntity {
  constructor(cartItem, productData) {
    const { doc } = productData;
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.productID = cartItem.productID;

    const requiredVariantDetails = data.variants.find(
      (variant) => variant.consoleName === cartItem.variant
    );
    this.variant = cartItem.variant;
    this.count = cartItem.count;
    this.price =
      requiredVariantDetails.price.currency +
      requiredVariantDetails.price.value.toFixed(2);
    this.totalPrice =
      requiredVariantDetails.price.currency +
      (cartItem.count * requiredVariantDetails.price.value).toFixed(2);
    this.boxArtUrl = productData.boxArtUrl;
  }

  dispose() {
    URL.revokeObjectURL(this.boxArtUrl);
  }
}
