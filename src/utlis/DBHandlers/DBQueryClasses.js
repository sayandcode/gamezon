import {
  collection,
  limit as firebaseLimit,
  limitToLast as firebaseLimitToLast,
  query,
  startAfter as firebaseStartAfter,
  startAt as firebaseStartAt,
  endBefore as firebaseEndBefore,
  orderBy as firebaseOrderBy,
  FieldPath,
  where,
} from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';

const GAMES_DB_COLLECTION_NAME = 'games';

export class DatabaseQuery {
  constructor(key, comparison, value, collectionName) {
    // if any of the following parameter is missing, throw an error
    const allParams = { key, comparison, value, collectionName };
    const undefinedParams = Object.entries(allParams)
      .filter(([, paramVal]) => paramVal === undefined)
      .map(([paramName]) => paramName);

    // TODO: implement field 'exists' query feature
    // if comparison === 'exists' and value === undefined, then pop it off the undefined params stack
    // cause thats a special case for a query

    if (undefinedParams.length !== 0) {
      throw new Error(
        `[${undefinedParams.join(
          ', '
        )}] parameter(s) are missing:\n${JSON.stringify(allParams)}`
      );
    }

    this.key = key;
    this.comparison = comparison;
    this.value = value;
    this.collectionName = collectionName;
  }

  extractQuery() {
    const constraints = [];
    if (this.limitNo) constraints.push(firebaseLimit(this.limitNo));
    if (this.limitToLastNo)
      constraints.push(firebaseLimitToLast(this.limitToLastNo));

    if (this.orderByField !== undefined) {
      const dir = this.orderDesc ? 'desc' : 'asc';
      const finalField =
        this.orderByField === null ? FieldPath.documentId() : this.orderByField;
      constraints.push(firebaseOrderBy(finalField, dir));
    }

    if (this.startAfterDoc)
      constraints.push(firebaseStartAfter(this.startAfterDoc));
    if (this.startAtDoc) constraints.push(firebaseStartAt(this.startAfterDoc));
    if (this.endBeforeDoc)
      constraints.push(firebaseEndBefore(this.endBeforeDoc));

    return query(
      collection(firestoreDB, this.collectionName),
      where(this.key, this.comparison, this.value),
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

  startAt(RootDBEntityItem) {
    if (this.startAfterDoc)
      throw new Error('"startAt" cannot be called along with "startAfter"');
    if (!RootDBEntityItem) {
      console.warn('"startAt" constraint called with empty parameter', {
        RootDBEntityItem,
      });
      return this;
    }

    let copy;
    if (!this.orderByField)
      copy = this.orderBy(); // orderBy is compulsory for startAfter
    else copy = this.clone();

    const docRef = RootDBEntityItem.getRef();
    copy.startAtDoc = docRef;
    return copy;
  }

  startAfter(RootDBEntityItem) {
    if (this.startAtDoc)
      throw new Error('"startAfter" cannot be called along with "startAt"');
    if (!RootDBEntityItem) {
      console.warn('"startAfter" constraint called with empty parameter', {
        RootDBEntityItem,
      });
      return this;
    }

    let copy;
    if (!this.orderByField)
      copy = this.orderBy(); // orderBy is compulsory for startAfter
    else copy = this.clone();

    const docRef = RootDBEntityItem.getRef();
    copy.startAfterDoc = docRef;
    return copy;
  }

  endBefore(RootDBEntityItem) {
    if (!RootDBEntityItem) {
      console.warn('"endBefore" constraint called with empty parameter', {
        RootDBEntityItem,
      });
      return this;
    }

    let copy;
    if (!this.orderByField)
      copy = this.orderBy(); // orderBy is compulsory for endBefore
    else copy = this.clone();

    const docRef = RootDBEntityItem.getRef();
    copy.endBeforeDoc = docRef;
    return copy;
  }

  orderBy(field, { descending } = { descending: false }) {
    // Uncaught (in promise) FirebaseError: Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field 'discount' and so you must also use 'discount' as your first argument to orderBy(), but your first orderBy() is on field 'Title' instead.
    const copy = this.clone();
    copy.orderByField = (() => {
      const processedFieldName = field?.toLowerCase();
      switch (processedFieldName) {
        case 'title':
          return 'Title';
        case 'price':
          return 'startingPrice.value';
        case 'discount':
          return 'discount';
        default:
          return null;
      }
    })();
    copy.orderDesc = descending;
    return copy;
  }
}

export class GameDatabaseQuery extends DatabaseQuery {
  constructor(key, comparison, value) {
    super(key, comparison, value, GAMES_DB_COLLECTION_NAME);
  }
}
