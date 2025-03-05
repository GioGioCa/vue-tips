// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD78FZN5Du2G179Bdy7l76MVVaxF-JoKlE",
    authDomain: "tips-553c5.firebaseapp.com",
    projectId: "tips-553c5",
    storageBucket: "tips-553c5.firebasestorage.app",
    messagingSenderId: "372303172199",
    appId: "1:372303172199:web:1532b31aa40c77c59cfac2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };