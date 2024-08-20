// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUatAi0upgwalV2ac4y_VdPuzwatL9K1M",
  authDomain: "flashcardsproject-926d8.firebaseapp.com",
  projectId: "flashcardsproject-926d8",
  storageBucket: "flashcardsproject-926d8.appspot.com",
  messagingSenderId: "503661618380",
  appId: "1:503661618380:web:97e5333f87f6cfe0a50e69",
  measurementId: "G-QWFX3GGEVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app)

export {db}