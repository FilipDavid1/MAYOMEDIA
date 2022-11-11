import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBsEPDd_V_oxiA_hfNFFn1n0dOTAdHPscE",
  authDomain: "mayomedia-72317.firebaseapp.com",
  databaseURL: "https://mayomedia-72317-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mayomedia-72317",
  storageBucket: "mayomedia-72317.appspot.com",
  messagingSenderId: "150149852780",
  appId: "1:150149852780:web:3ae4926c3644570c74f249"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

export { auth, database, set, ref, update, createUserWithEmailAndPassword, signInWithEmailAndPassword };