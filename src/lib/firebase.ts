
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCndVPQOLSXFoUv6EuuWMWdOP1TRK9TvSU",
  authDomain: "bakebook-auth.firebaseapp.com",
  projectId: "bakebook-auth",
  storageBucket: "bakebook-auth.firebasestorage.app",
  messagingSenderId: "285359713592",
  appId: "1:285359713592:web:858e22cfb9783068e625cd"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, app, db };
