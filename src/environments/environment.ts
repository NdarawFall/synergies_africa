// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// REMPLACEZ CECI PAR LA CONFIGURATION DE VOTRE NOUVEAU PROJET FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyA06oe84rYc2yuMHwcKz2y_kNYNrZYsLxg",
    authDomain: "synergieafrica-33292.firebaseapp.com",
    projectId: "synergieafrica-33292",
    storageBucket: "synergieafrica-33292.firebasestorage.app",
    messagingSenderId: "913848826589",
    appId: "1:913848826589:web:764360590b5b0affd87934",
    measurementId: "G-QV2910E6H0" // Optionnel
};

export const environment = {
    production: false,
    firebase: firebaseConfig, // Assurez-vous que ceci pointe vers votre nouvelle config
    supabase: {
        url: 'https://gxtymvfvcbvatlfyflow.supabase.co', // Remplacez par l'URL de votre projet Supabase
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4dHltdmZ2Y2J2YXRsZnlmbG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDAyMDAsImV4cCI6MjA2MzUxNjIwMH0.x7xaTQf86ymVw9mfaFcL8qVMQuEgha9v7Rny1DngIfM', // Remplacez par votre clé publique (anon key) Supabase
    },
    cloudinary: {
        cloudName: 'dkvympjyk', // Remplacez par votre Cloud Name Cloudinary
        uploadPreset: 'synergie_africa_upload', // Remplacez par votre Upload Preset (optionnel mais recommandé)
    },
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
