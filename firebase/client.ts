// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

//import { cert, getApps, initializeApp } from 'firebase/app';

//import { getAnalytics } from "firebase/analytics";

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5L9tQQwYlhusHTaLh0_hNVUSSz9loR1s",
  authDomain: "interviewprep-94b96.firebaseapp.com",
  projectId: "interviewprep-94b96",
  storageBucket: "interviewprep-94b96.firebasestorage.app",
  messagingSenderId: "948275075847",
  appId: "1:948275075847:web:66ac6cb2b9d19f773583a2",
  measurementId: "G-6FERY1GJNH"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const  db = getFirestore(app);