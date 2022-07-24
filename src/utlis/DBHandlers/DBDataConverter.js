import {
  Cart,
  generateProductID,
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
    this.cart = data.cartItems;
    this.wishlist = data.wishlistItems;
  }

  toLocalState() {
    return {
      // if the field doesn't exist, it defaults to the empty initialization of the class. So it works anyway
      cart: new Cart(this.cart),
      wishlist: new Wishlist(this.wishlist),
    };
  }

  static toDBForm(localData) {
    const [cart, wishlist] = [localData.cart, localData.wishlist];

    // if a field is empty, delete the field
    const cartItems = cart.isEmpty ? undefined : cart.contents;
    const wishlistItems = wishlist.isEmpty ? undefined : wishlist.contents;

    return {
      ...(cartItems && { cartItems }),
      ...(wishlistItems && { wishlistItems }),
    };
  }
}

export class CartItemDataHandler extends RootDatabaseEntity {
  constructor(doc, { boxArtUrl, variant: requiredVariant, count }) {
    super(doc);
    const { data } = doc;
    this.title = data.Title;
    this.productID = generateProductID(data.Title, requiredVariant);

    const requiredVariantDetails = data.variants.find(
      (variant) => variant.consoleName === requiredVariant
    );
    this.variant = requiredVariant;
    this.count = count;
    this.price =
      requiredVariantDetails.price.currency +
      requiredVariantDetails.price.value.toFixed(2);
    this.totalPrice =
      requiredVariantDetails.price.currency +
      (count * requiredVariantDetails.price.value).toFixed(2);
    this.boxArtUrl = boxArtUrl;
  }

  static async createFrom(cartItemDoc, variant, count = 1) {
    const gameTitle = cartItemDoc.data.Title;
    const boxArtUrl = await getboxArtFor(gameTitle);

    return new CartItemDataHandler(cartItemDoc, { boxArtUrl, variant, count });
  }

  dispose() {
    URL.revokeObjectURL(this.boxArtUrl);
  }
}
