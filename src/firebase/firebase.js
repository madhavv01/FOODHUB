import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC7TPInJ-e6ZUrXuEjkLpEovU7Q2CgjOZw",
  authDomain: "restaurent-c8b92.firebaseapp.com",
  databaseURL: "https://restaurent-c8b92-default-rtdb.firebaseio.com",
  projectId: "restaurent-c8b92",
  storageBucket: "restaurent-c8b92.appspot.com",
  messagingSenderId: "25442448684",
  appId: "1:25442448684:web:0d226adb49405c9b90e889",
  measurementId: "G-4TL2YK90E5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);