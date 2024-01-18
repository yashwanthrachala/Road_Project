// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCkdkk1m2HEpN_l6L6vVgHfWF5tpmQ7WQs",
    authDomain: "data-collector-a93d2.firebaseapp.com",
    projectId: "data-collector-a93d2",
    storageBucket: "data-collector-a93d2.appspot.com",
    messagingSenderId: "921897388846",
    appId: "1:921897388846:web:0c9cad128e3920ad9ac8bf",
    measurementId: "G-S5S21CEPZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;