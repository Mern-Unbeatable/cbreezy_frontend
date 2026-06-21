import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCebsLVPWpLvdEAHUdnl_OAoHnelYOZsRY",
  authDomain: "sidegurus-9b66d.firebaseapp.com",
  projectId: "sidegurus-9b66d",
  storageBucket: "sidegurus-9b66d.firebasestorage.app",
  messagingSenderId: "622139952481",
  appId: "1:622139952481:web:44e7d0808ddbc60a9bc920",
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
