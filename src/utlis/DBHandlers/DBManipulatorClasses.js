import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';

const USERS_DB_COLLECTION_NAME = 'users';

class DatabaseManipulator {
  static async getDocument({ docName }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    const fetchedDoc = await getDoc(docRef);
    if (fetchedDoc.exists())
      return { ref: fetchedDoc, data: fetchedDoc.data() };
    return undefined;
  }

  static deleteDocument({ docName }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    deleteDoc(docRef);
  }

  static setDocument({ docName, data }) {
    const docRef = doc(firestoreDB, this.collectionName, docName);
    setDoc(docRef, data);
  }
}

// eslint-disable-next-line import/prefer-default-export
export class UsersDatabase extends DatabaseManipulator {
  static #collectionName = USERS_DB_COLLECTION_NAME; // private so that it cant be changed

  static get collectionName() {
    return this.#collectionName;
  }

  static delete({ userID }) {
    this.deleteDocument({ docName: userID });
  }

  static set({ userID, data }) {
    this.setDocument({ docName: userID, data });
  }

  static async get({ userID }) {
    return this.getDocument({ docName: userID });
  }
}
