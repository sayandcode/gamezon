import {
  collection,
  limit as firebaseLimit,
  limitToLast as firebaseLimitToLast,
  query,
  startAfter as firebaseStartAfter,
  startAt as firebaseStartAt,
  endBefore as firebaseEndBefore,
  orderBy as firebaseOrderBy,
  where as firebaseWhere,
} from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';
import {
  GAME_DB_COLLECTION_NAME,
  ORDER_DB_COLLECTION_NAME,
  USERS_DB_COLLECTION_NAME,
} from './DBNames';

export class DatabaseQuery {
  static convertToDatabaseComparison(comparison) {
    switch (comparison) {
      case 'includes':
        return 'array-contains';
      default:
        return comparison;
    }
  }

  constructor(collectionPath) {
    this.collectionPath = collectionPath;
  }

  where(key, comparison, value) {
    // if any of the following parameter is missing, throw an error
    const requiredParams =
      comparison === 'exists' ? { key } : { key, comparison, value };
    checkIfParamsPresent(requiredParams);

    // if comparison is 'exists', you can add an orderBy clause instead, just to filter it out.
    // First we order by the default field, and then by the exists field
    if (comparison === 'exists') return this.orderBy().orderBy(key);

    const copy = this.clone();
    const officialFieldName = this.constructor.convertToDatabaseField(key);
    const officialComparison =
      this.constructor.convertToDatabaseComparison(comparison);

    copy.whereFields = copy.whereFields || [];
    copy.whereFields.push({
      key: officialFieldName,
      comparison: officialComparison,
      value,
    });
    return copy;
  }

  extractQuery() {
    const constraints = [];

    this.whereFields?.forEach((field) =>
      constraints.push(firebaseWhere(field.key, field.comparison, field.value))
    );
    this.orderByFields?.forEach((field) => {
      const dir = field.desc ? 'desc' : 'asc';
      constraints.push(firebaseOrderBy(field.key, dir));
    });

    if (this.limitNo) constraints.push(firebaseLimit(this.limitNo));
    if (this.limitToLastNo)
      constraints.push(firebaseLimitToLast(this.limitToLastNo));
    if (this.startAfterDoc)
      constraints.push(firebaseStartAfter(this.startAfterDoc));
    if (this.startAtDoc) constraints.push(firebaseStartAt(this.startAfterDoc));
    if (this.endBeforeDoc)
      constraints.push(firebaseEndBefore(this.endBeforeDoc));

    return query(
      collection(firestoreDB, ...this.collectionPath),
      ...constraints
    );
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  /* The following are constraint methods, intended to narrow the field of search */
  /* They all return a copy of the original query. This keeps the fn pure, and also allows for chaining */

  limit(number) {
    if (this.limitToLastNo)
      throw new Error('"limitToLast" cannot be called along with "limit"');

    const copy = this.clone();
    copy.limitNo = number;
    return copy;
  }

  limitToLast(number) {
    if (this.limitNo)
      throw new Error('"limit" cannot be called along with "limitToLast"');

    const copy = this.clone();
    copy.limitToLastNo = number;
    return copy;
  }

  // if 'startAt', 'startAfter' or 'endBefore' is called, you better make sure there is an orderBy
  // going on this is because it can be used polymorphically, such that the first call is empty,
  // but subsequent calls have a RootDBEntityItem. But we still need to make sure that the first
  // result and the subsequent ones are part of the same order

  startAt(RootDBEntityItem) {
    if (this.startAfterDoc)
      throw new Error('"startAt" cannot be called along with "startAfter"');

    let copy;
    if (!this.orderByFields)
      copy = this.orderBy(); // orderBy is compulsory for startAt
    else copy = this.clone();

    if (!RootDBEntityItem) {
      console.warn('"startAt" constraint called with empty parameter', {
        RootDBEntityItem,
      });
      return copy;
    }
    // if  there is an entity provided, then set the ref
    const docRef = RootDBEntityItem.getRef();
    copy.startAtDoc = docRef;
    return copy;
  }

  startAfter(RootDBEntityItem) {
    if (this.startAtDoc)
      throw new Error('"startAfter" cannot be called along with "startAt"');

    let copy;
    if (!this.orderByFields)
      copy = this.orderBy(); // orderBy is compulsory for startAfter
    else copy = this.clone();

    if (!RootDBEntityItem) {
      console.warn('"startAfter" constraint called with empty parameter', {
        RootDBEntityItem,
      });
      return copy;
    }
    // if  there is an entity provided, then set the ref
    const docRef = RootDBEntityItem.getRef();
    copy.startAfterDoc = docRef;
    return copy;
  }

  endBefore(RootDBEntityItem) {
    let copy;
    if (!this.orderByFields)
      copy = this.orderBy(); // orderBy is compulsory for endBefore
    else copy = this.clone();

    if (!RootDBEntityItem) {
      console.warn('"endBefore" constraint called with empty parameter', {
        RootDBEntityItem,
      });
      return this;
    }
    // if  there is an entity provided, then set the ref
    const docRef = RootDBEntityItem.getRef();
    copy.endBeforeDoc = docRef;
    return copy;
  }

  orderBy(field, { descending } = { descending: false }) {
    const copy = this.clone();

    copy.orderByFields = copy.orderByFields || [];
    const officialFieldName = copy.constructor.convertToDatabaseField(field);

    // if its already added, remove it, and then add the new one at the end
    const indexOfAlreadyAdded = copy.orderByFields.findIndex(
      (order) => order.key === officialFieldName
    );
    if (indexOfAlreadyAdded !== -1)
      copy.orderByFields.splice(indexOfAlreadyAdded, 1);
    copy.orderByFields.push({ key: officialFieldName, desc: descending });

    // if the query already has an inequality filter (<, <=, !=, not-in, >, or >=)
    // then orderBy that field first
    const hasInequalityFilter = copy.whereFields?.find((where) =>
      ['<', '<=', '!=', 'not-in', '>', '>='].includes(where.comparison)
    );
    if (hasInequalityFilter) {
      copy.orderByFields.splice(0, 0, {
        key: hasInequalityFilter.key,
        desc: descending,
      });
      console.warn(
        `An inequality filter: "`,
        hasInequalityFilter.comparison,
        `" was used. So sequence of orderBy is`,
        copy.orderByFields
      );
    }

    return copy;
  }
}

export class GameDatabaseQuery extends DatabaseQuery {
  static convertToDatabaseField(field) {
    const processedFieldName = field?.toLowerCase();
    switch (processedFieldName) {
      case 'title':
        return 'Title';
      case 'price':
        return 'startingPrice.value';
      case 'discount':
        return 'discount';
      case 'spotlight':
        return 'spotlight';
      case 'consoles':
        return 'Console(s)';

      case undefined:
        return 'Title'; // Title is chosen as the default sorting for the GameDatabaseQuery
      default:
        throw new Error(
          `Unknown field: ${field}\n Please request to add this field in DBQueryClasses`
        );
    }
  }

  constructor() {
    const collectionPath = [GAME_DB_COLLECTION_NAME];
    super(collectionPath);
  }
}

export class OrderDatabaseQuery extends DatabaseQuery {
  static convertToDatabaseField(field) {
    const processedFieldName = field?.toLowerCase();
    switch (processedFieldName) {
      case 'date':
        return 'timeStamp';
      case undefined:
        return 'orderID'; // orderID is chosen as the default sorting for the OrderDatabaseQuery

      default:
        throw new Error(
          `Unknown field: ${field}\n Please request to add this field in DBQueryClasses`
        );
    }
  }

  constructor({ userID }) {
    const collectionPath = [
      USERS_DB_COLLECTION_NAME,
      userID,
      ORDER_DB_COLLECTION_NAME,
    ];
    super(collectionPath);
  }
}

function checkIfParamsPresent(requiredParams) {
  const undefinedParams = Object.entries(requiredParams)
    .filter(([, paramVal]) => paramVal === undefined)
    .map(([paramName]) => paramName);

  if (undefinedParams.length !== 0) {
    throw new Error(
      `[${undefinedParams.join(
        ', '
      )}] parameter(s) are missing:\n${JSON.stringify(requiredParams)}`
    );
  }
}
