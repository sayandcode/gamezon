import { getDataFromQuery } from '../../../utlis/DBHandlers/DBFetch';
import { OrderDatabaseQuery } from '../../../utlis/DBHandlers/DBQueryClasses';
import OrderHandler from './OrderHandler';

class OrdersPageDataHandler {
  #userID;

  #ordersPerPage;

  #cachedOrderHandlers = [];

  #lastPage;

  get #pagesCached() {
    const noOfOrdersCached = this.#cachedOrderHandlers.length;
    return Math.floor(noOfOrdersCached / this.#ordersPerPage);
  }

  get #lastFetchedOrder() {
    return this.#cachedOrderHandlers.slice(-1)[0];
  }

  get #noOfOrdersToFetch() {
    /* For the first page we need to fetch no of orders per page, and one more.
    For subsequent pages we only need to fetch one less than initial number, 
    since we already have the first item for the new range, in cache. */
    return this.#cachedOrderHandlers.length === 0
      ? this.#ordersPerPage + 1
      : this.#ordersPerPage;
  }

  constructor({ userID, ordersPerPage }) {
    this.#userID = userID;
    this.#ordersPerPage = ordersPerPage;
  }

  async #updateCache(currPage) {
    const ordersToFetchInThisUpdate = this.#noOfOrdersToFetch;
    const allOrdersQuery = new OrderDatabaseQuery({ userID: this.#userID })
      .orderBy('date', { descending: true })
      .limit(ordersToFetchInThisUpdate)
      .startAfter(this.#lastFetchedOrder);
    const orderDocs = await getDataFromQuery(allOrdersQuery);
    const orderHandlers = await Promise.all(
      orderDocs.map((orderDoc) => OrderHandler.createFor(orderDoc))
    );
    this.#cachedOrderHandlers.push(...orderHandlers);

    const moreAvailable = orderDocs.length === ordersToFetchInThisUpdate;
    if (!moreAvailable) this.#lastPage = currPage;
  }

  async #retrieveFromCache(pageNo) {
    const pageIndex = pageNo - 1;
    const startIndex = pageIndex * this.#ordersPerPage;
    const endIndex = startIndex + this.#ordersPerPage; // includes one extra for how slice works
    return this.#cachedOrderHandlers.slice(startIndex, endIndex);
  }

  /* 👇 PUBLIC METHODS👇 */

  async getOrdersData(pageNo) {
    if (this.#pagesCached < pageNo) await this.#updateCache(pageNo);
    return this.#retrieveFromCache(pageNo);
  }

  get lastPage() {
    return this.#lastPage;
  }

  dispose() {
    this.#cachedOrderHandlers.forEach((handler) => handler.dispose());
  }
}

export default OrdersPageDataHandler;
