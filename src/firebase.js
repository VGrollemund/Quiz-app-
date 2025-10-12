// Import des fonctions nécessaires
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

//  Configuration Firebase de ton projet (celle que tu as copiée)
const firebaseConfig = {
  apiKey: "AIzaSyDGqrOWOD7eVkYPVMC06zg0dOCBCE9N9o8",
  authDomain: "rom-charrette.firebaseapp.com",
  projectId: "rom-charrette",
  storageBucket: "rom-charrette.firebasestorage.app",
  messagingSenderId: "95518864745",
  appId: "1:95518864745:web:8165ec070e6931372679f8",
  measurementId: "G-QH40RGQTXE"
};

//  Initialisation de Firebase
const app = initializeApp(firebaseConfig);

//  <Services utilisés par ton app
export const auth = getAuth(app);
export const db = getFirestore(app);

// (facultatif) Analytics
const analytics = getAnalytics(app);

export default app;

