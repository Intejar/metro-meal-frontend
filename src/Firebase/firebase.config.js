// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF7dLjqgxKrMTxJRbN0h7_lkKgSubjgmA",
  authDomain: "metromeal-a5222.firebaseapp.com",
  projectId: "metromeal-a5222",
  storageBucket: "metromeal-a5222.appspot.com",
  messagingSenderId: "237255250564",
  appId: "1:237255250564:web:4a44bffbc804c4bbcea8d1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }; // Export both app and auth
