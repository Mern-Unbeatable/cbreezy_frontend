import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBlYQP-i2SpD81xVbbHfk6IoCGl2GltSA4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cbreezy-9b213.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cbreezy-9b213",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cbreezy-9b213.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "333273448928",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:333273448928:web:181d1791aeafc5bd0a6b85",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
