import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcsJM946P4-IR1q6zaZBd2fINxBKhMSuU",
  authDomain: "legalassociate-8d096.firebaseapp.com",
  projectId: "legalassociate-8d096",
  storageBucket: "legalassociate-8d096.firebasestorage.app",
  messagingSenderId: "43613217831",
  appId: "1:43613217831:web:ba1de65bea02fc08d8da02",
  measurementId: "G-SQSE3E8G3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services (Using Firebase Storage instead of Supabase)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Enable auth persistence (should be default, but explicitly set it)
if (typeof window !== 'undefined') {
  import('firebase/auth').then(({ setPersistence, browserLocalPersistence }) => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
  });
}

export default app;
