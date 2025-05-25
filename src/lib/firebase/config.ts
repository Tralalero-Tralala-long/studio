
// IMPORTANT: Replace with your actual Firebase project configuration!
// You can find this in your Firebase project settings.
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
// import { getAuth, type Auth } from 'firebase/auth'; // Commented out as auth is simulated
// import { getFirestore, type Firestore } from 'firebase/firestore'; // Commented out

/*
// Firebase is not being used for core authentication or "My Coupons" in this version.
// If other features (e.g., Genkit flows directly using Firestore) need it,
// this configuration would need to be active and correct.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", 
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional
};


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app); 

export { app, auth, db };
*/

// Minimal export to prevent build errors if other files still import 'app', 'auth', 'db'
// but these will not be functional Firebase instances unless uncommented and configured.
export const app = null;
export const auth = null;
export const db = null;
