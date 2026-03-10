
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyArQ22rmsL0GgBgO1X5B_RPicbQSG4OnZQ",
  authDomain: "trading-46447.firebaseapp.com",
  projectId: "trading-46447",
  storageBucket: "trading-46447.firebasestorage.app",
  messagingSenderId: "312732392685",
  appId: "1:312732392685:web:6ba83c0268e7f1265d80e4",
  measurementId: "G-2K7X81FW3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;