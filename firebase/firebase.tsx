// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNCRMVQNY1x4i26tJc3NjsmKTtA_a95y8",
  authDomain: "auth-keep.firebaseapp.com",
  projectId: "auth-keep",
  storageBucket: "auth-keep.appspot.com",
  messagingSenderId: "309207390128",
  appId: "1:309207390128:web:3f1564ac5a216701666875",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
