import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz4Lxjr1oRtYpfixAjRDp4PaxR13sX2jA", // e.g., ""
  authDomain: "bgmiscrims13.firebaseapp.com", // e.g., "bgmiscrims13.firebaseapp.com"
  projectId: "bgmiscrims13", // e.g., "bgmiscrims13"
  storageBucket: "bgmiscrims13.firebasestorage.app", // e.g., "bgmiscrims13.firebasestorage.app"
  messagingSenderId: "1024604600271", // e.g., "1024604600271"
  appId: "1:1024604600271:web:c99fe2366f224d766704ba", // e.g., "1:1024604600271:web:c99fe2366f224d766704ba"
  measurementId: "G-L292J1E3G5", // e.g., "G-L292J1E3G5"
  
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
