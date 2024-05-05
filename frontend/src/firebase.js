// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,GithubAuthProvider} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { APIKEY } from "./Asset";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: "stackoverflow-b6223.firebaseapp.com",
  projectId: "stackoverflow-b6223",
  storageBucket: "stackoverflow-b6223.appspot.com",
  messagingSenderId: "901920566798",
  appId: "1:901920566798:web:acef7ca144339a1d65d65f",
  measurementId: "G-GMZ2RW9WWE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
export const gitProvider = new GithubAuthProvider();