import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyChEJp6vPpRbkTS8ybzlQ4ft4qxKmVVkWA",
    authDomain: "simon-dice-4309b.firebaseapp.com",
    projectId: "simon-dice-4309b",
    storageBucket: "simon-dice-4309b.firebasestorage.app",
    messagingSenderId: "690435174962",
    appId: "1:690435174962:web:1343bccfdb247377b8c22b",
    measurementId: "G-74LM6NVGFM"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };  