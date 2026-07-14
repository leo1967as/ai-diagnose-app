import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMpREKAliE7BKAMe85fVw_THrfEy1AFh8",
  authDomain: "composed-circle-301413.firebaseapp.com",
  projectId: "composed-circle-301413",
  storageBucket: "composed-circle-301413.firebasestorage.app",
  messagingSenderId: "648549376186",
  appId: "1:648549376186:web:fa612fa7d57ff435522283"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Note: Anonymous authentication is disabled in Firebase Console
// Feedback submission works without authentication due to Firestore rules

export { db };