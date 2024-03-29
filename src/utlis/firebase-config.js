// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDNyHj8AM3oYtM4Rd1IOME1titogXdu9Co',
  authDomain: 'gamezon-d02db.firebaseapp.com',
  projectId: 'gamezon-d02db',
  storageBucket: 'gamezon-d02db.appspot.com',
  messagingSenderId: '856449092517',
  appId: '1:856449092517:web:be1f532e6b0736d6d1364c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// eslint-disable-next-line import/prefer-default-export
export const auth = getAuth(app);
export const firestoreDB = getFirestore(app);
export const firebaseStorage = getStorage(app);
