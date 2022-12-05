import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
import { getFirestore, doc, addDoc, collection, getDocs, onSnapshot, deleteDoc, updateDoc} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getDatabase();

// initialize firestore
export const db = getFirestore();




export { set, ref, update, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, doc, addDoc, collection, getDocs, onSnapshot, deleteDoc, updateDoc };
export { sRef, uploadBytesResumable, getDownloadURL, getStorage };