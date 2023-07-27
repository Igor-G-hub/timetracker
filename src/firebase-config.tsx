// Import the funcions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: "timetracker-app-4e596",
  storageBucket: "timetracker-app-4e596.appspot.com",
  messagingSenderId: "105025669260",
  appId: "1:105025669260:web:596210f3cfdb824a8113a9",
  measurementId: "G-4BSVLZKJXF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);