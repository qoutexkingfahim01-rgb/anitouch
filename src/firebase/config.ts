import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQPztPxro3JhGNHmVInb7GAL-bvAz15AI",
  authDomain: "anitouchbd-9c03c.firebaseapp.com",
  projectId: "anitouchbd-9c03c",
  storageBucket: "anitouchbd-9c03c.firebasestorage.app",
  messagingSenderId: "220820597356",
  appId: "1:220820597356:web:d959cd41c8c3c803128649"
};

// এই লাইনটি চেক করবে যে আপনার ব্রাউজার সঠিক Key পাচ্ছে কিনা
console.log("My Firebase API Key is:", firebaseConfig.apiKey);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);