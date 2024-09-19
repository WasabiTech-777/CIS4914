// /firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

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

// Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const analytics = getAnalytics(app);
export { auth };
