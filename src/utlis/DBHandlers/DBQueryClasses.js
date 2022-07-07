import { collection, query, where } from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';

const GAMES_DB_COLLECTION_NAME = 'games';

export class DatabaseQuery {
  constructor(key, comparison, value, collectionName) {
    // if any parameter is missing, throw an error
    const allParams = { key, comparison, value, collectionName };
    const undefinedParams = Object.entries(allParams)
      .filter(([, paramVal]) => paramVal === undefined)
      .map(([paramName]) => paramName);

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
    return query(
      collection(firestoreDB, this.collectionName),
      where(this.key, this.comparison, this.value)
    );
  }
}

export class GameDatabaseQuery extends DatabaseQuery {
  constructor(key, comparison, value) {
    super(key, comparison, value, GAMES_DB_COLLECTION_NAME);
  }
}
