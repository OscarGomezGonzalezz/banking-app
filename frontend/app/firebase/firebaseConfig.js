// firebaseConfig.js
import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";

// Firebase config obtained from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBcCltzDhAHxbSco5dzQdteelIMy6Zuujc",
  authDomain: "banking-app-5550a.firebaseapp.com",
  projectId: "banking-app-5550a",
  storageBucket: "banking-app-5550a.firebasestorage.app",
  messagingSenderId: "683658605841",
  appId: "1:683658605841:web:ca6528f18982c98347c8b0"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;