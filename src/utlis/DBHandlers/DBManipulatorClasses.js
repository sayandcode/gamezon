import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';

const USERS_DB_COLLECTION_NAME = 'users';
const GAME_DB_COLLECTION_NAME = 'games';

class DBManipulator {
  #collectionName;

  constructor(collectionName) {
    this.#collectionName = collectionName;
  }

  get collectionName() {
    return this.#collectionName;
  }

  async getDocument({ docName }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    const fetchedDoc = await getDoc(docRef);
    if (fetchedDoc.exists())
      return { ref: fetchedDoc, data: fetchedDoc.data() };
    return undefined;
  }

  async deleteDocument({ docName }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    return deleteDoc(docRef);
  }

  async setDocument({ docName, data }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    return setDoc(docRef, data);
  }
}

function createDBManipulator(collectionName, docNameAlias) {
  const DBManipInstance = new DBManipulator(collectionName);
  const extendedMethods = {
    get({ [docNameAlias]: docName }) {
      return this.getDocument({ docName });
    },
    set({ [docNameAlias]: docName, data }) {
      return this.setDocument({ docName, data });
    },
    delete({ [docNameAlias]: docName }) {
      return this.deleteDocument({ docName });
    },
  };
  return Object.assign(DBManipInstance, extendedMethods);
}

const UsersDatabase = createDBManipulator(GAME_DB_COLLECTION_NAME, 'userID');
const GameDatabase = createDBManipulator(USERS_DB_COLLECTION_NAME, 'title');

export { UsersDatabase, GameDatabase };
