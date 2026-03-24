import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMSGG7Rui_01qaJO3If2cZmvPECPZvsOs",
  authDomain: "inventory-system-d912e.firebaseapp.com",
  projectId: "inventory-system-d912e",
  storageBucket: "inventory-system-d912e.firebasestorage.app",
  messagingSenderId: "800058118309",
  appId: "1:800058118309:web:f33bdf21f7c4430ba6bd4c",
  measurementId: "G-WPQ9NV102E"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics conditionally (only in browser)
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) getAnalytics(app);
  });
}

export { auth, db };