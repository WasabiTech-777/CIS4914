import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your Firebase configuration from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyC_tztX19mBA_kyHHGitsPex2eh856UruY",
  authDomain: "journeylink-60cac.firebaseapp.com",
  projectId: "journeylink-60cac",
  storageBucket: "journeylink-60cac.appspot.com",
  messagingSenderId: "259673028525",
  appId: "1:259673028525:web:e51f72430e0de258485324",
  measurementId: "G-54HWNK052C"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth: Auth = getAuth(app);

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Initialize Firebase Storage
const storage: FirebaseStorage = getStorage(app);
// Conditionally initialize Firebase Analytics
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } else {
    console.log('Firebase Analytics is not supported in this environment.');
  }
}).catch((error) => {
  console.error('Error checking analytics support:', error);
});

export { auth, db, storage };
