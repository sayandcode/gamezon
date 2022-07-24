import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';

const USERS_DB_COLLECTION_NAME = 'users';
const GAME_DB_COLLECTION_NAME = 'games';

class DatabaseManipulator {
  static async getDocument({ docName }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    const fetchedDoc = await getDoc(docRef);
    if (fetchedDoc.exists())
      return { ref: fetchedDoc, data: fetchedDoc.data() };
    return undefined;
  }

  static async deleteDocument({ docName }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    return deleteDoc(docRef);
  }

  static async setDocument({ docName, data }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    return setDoc(docRef, data);
  }
}

export class UsersDatabase extends DatabaseManipulator {
  static #collectionName = USERS_DB_COLLECTION_NAME; // private so that it cant be changed

  static get collectionName() {
    return this.#collectionName;
  }

  static async delete({ userID }) {
    return this.deleteDocument({ docName: userID });
  }

  static async set({ userID, data }) {
    return this.setDocument({ docName: userID, data });
  }

  static async get({ userID }) {
    return this.getDocument({ docName: userID });
  }
}

export class GameDatabase extends DatabaseManipulator {
  static #collectionName = GAME_DB_COLLECTION_NAME; // private so that it cant be changed

  static get collectionName() {
    return this.#collectionName;
  }

  static async delete({ title }) {
    return this.deleteDocument({ docName: title });
  }

  static async set({ title, data }) {
    return this.setDocument({ docName: title, data });
  }

  static async get({ title }) {
    return this.getDocument({ docName: title });
  }
}
