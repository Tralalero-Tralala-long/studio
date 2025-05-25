
// IMPORTANT: Replace with your actual Firebase project configuration!
// You can find this in your Firebase project settings.
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDDtgssOq6Jc9f4QyYSk26fs3HN2CPv2u0", // Replace with your actual API key if different
  authDomain: "promopulse-tstsj.firebaseapp.com",
  projectId: "promopulse-tstsj",
  storageBucket: "promopulse-tstsj.firebasestorage.app",
  messagingSenderId: "255108708296",
  appId: "1:255108708296:web:fb99b31ff13b937b93f2fd"
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional: REPLACE THIS if you use Analytics
};


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app); // Initialize Firestore

export { app, auth, db }; // Export db
