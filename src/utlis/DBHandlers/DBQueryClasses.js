import { collection, query, where } from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';

const GAMES_DB_COLLECTION_NAME = 'games';

class DatabaseQuery {
  constructor(key, comparison, value, collectionName) {
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

console.log(); // remove this eslint later
// eslint-disable-next-line import/prefer-default-export
export class GameDatabaseQuery extends DatabaseQuery {
  constructor(key, comparison, value) {
    super(key, comparison, value, GAMES_DB_COLLECTION_NAME);
  }
}
