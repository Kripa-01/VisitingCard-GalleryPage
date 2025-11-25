import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0a3b46pj87PB-YaaRa8zlp4wFFZSMkdc",
  authDomain: "visitingcard-d61db.firebaseapp.com",
  projectId: "visitingcard-d61db",
  storageBucket: "visitingcard-d61db.appspot.com",
  messagingSenderId: "639990622742",
  appId: "1:639990622742:web:0f4c522d9f727be46b6337",
  measurementId: "G-9TDW2RQ3LW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
