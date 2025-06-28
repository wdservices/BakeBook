
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD2q75YOHN0A_FCWH2CVj7SFhEr4mi7sro",
    authDomain: "bakebook-5c2bb.firebaseapp.com",
    projectId: "bakebook-5c2bb",
    storageBucket: "bakebook-5c2bb.firebasestorage.app",
    messagingSenderId: "76104951819",
    appId: "1:76104951819:web:500ddd43c79edd21187f0e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
