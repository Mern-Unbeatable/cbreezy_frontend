import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCebsLVPWpLvdEAHUdnl_OAoHnelYOZsRY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sidegurus-9b66d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sidegurus-9b66d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sidegurus-9b66d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "622139952481",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:622139952481:web:44e7d0808ddbc60a9bc920",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
