import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';

//html elements
const button = document.getElementById('submit');
const email = document.getElementById('email');
const name = document.getElementById('name');
const phone = document.getElementById('phone');
const message = document.getElementById('message');
const form = document.getElementById('contact-form');

//collection reference
const colRef = collection(db, 'contact');

//contact form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addDoc(colRef, {
        email: email.value,
        name: name.value,
        phone: phone.value,
        message: message.value
    })
    .then(() => {
        swal({
            title: "Správa bola odoslaná",
            icon: "success",
            button: "OK",
        })
        form.reset();
    })
})