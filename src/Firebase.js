import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBESsPGCxjlfNGtMmXNnrPKN2DmgXCirsQ",
  authDomain: "bill-invoice-app-f08a2.firebaseapp.com",
  projectId: "bill-invoice-app-f08a2",
  storageBucket: "bill-invoice-app-f08a2.appspot.com",
  messagingSenderId: "1088526474727",
  appId: "1:1088526474727:web:c4cb07605dfa4a8ab97142",
  measurementId: "G-R8Z1MXYMJ1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const firestore_database = getFirestore();