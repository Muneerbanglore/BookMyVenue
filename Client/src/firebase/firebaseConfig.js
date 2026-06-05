// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTb_KTLCLhQgAdkT-2M3uYzEJxrMC4_rw",
  authDomain: "book-my-venue-240e9.firebaseapp.com",
  projectId: "book-my-venue-240e9",
  storageBucket: "book-my-venue-240e9.firebasestorage.app",
  messagingSenderId: "667763493977",
  appId: "1:667763493977:web:aa088dd81f9f46b5af7548",
  measurementId: "G-CRWX6GB7QY"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Set up Auth and Google provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Helper function to trigger Google sign‑in and retrieve ID token
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();
    return { user, idToken };
  } catch (error) {
    console.error("Google sign‑in error:", error);
    throw error;
  }
};

export { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink };

export default app;
