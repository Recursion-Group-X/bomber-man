import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqiG7em_vvF7cjH_4r4h63TJ0cH-2XJpk",
  authDomain: "bomber-man-5c836.firebaseapp.com",
  projectId: "bomber-man-5c836",
  storageBucket: "bomber-man-5c836.appspot.com",
  messagingSenderId: "44352319115",
  appId: "1:44352319115:web:ca6d15be04f323f1446e8e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;