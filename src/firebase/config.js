// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5pLyAofTlet51iPIkoMZ-X7hjiqF7s-w",
  authDomain: "bongoliver-notification.firebaseapp.com",
  projectId: "bongoliver-notification",
  storageBucket: "bongoliver-notification.appspot.com",
  messagingSenderId: "922908565353",
  appId: "1:922908565353:web:6d9f5033fa29935e9127f8",
  measurementId: "G-J0Z94212R7"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firestore, auth };
export default firebase;