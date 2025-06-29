// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDa6R_icocjGIHvsZnHVe8A2U6H-mCQ0e4",
  authDomain: "scolarships-bolivia.firebaseapp.com",
  projectId: "scolarships-bolivia",
  storageBucket: "scolarships-bolivia.firebasestorage.app",
  messagingSenderId: "149439145447",
  appId: "1:149439145447:web:a9e91826ef5fd67357c942"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);