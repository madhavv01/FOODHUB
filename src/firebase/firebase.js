import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBzpotqBfYVAFl3fQOGx8kzHbVVTMG_QsI",
  authDomain: "restaurant-review-projec-3175e.firebaseapp.com",
  databaseURL: "https://restaurant-review-projec-3175e-default-rtdb.firebaseio.com",
  projectId: "restaurant-review-projec-3175e",
  storageBucket: "restaurant-review-projec-3175e.appspot.com",
  messagingSenderId: "528301841614",
  appId: "1:528301841614:web:a11ca9fa783bb8abc9849f",
  measurementId: "G-WQSG62BWKP"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);