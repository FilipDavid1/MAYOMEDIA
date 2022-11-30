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
const contactInfoRef = collection(db, 'contact-info');

//get contact info
onSnapshot(contactInfoRef, () => {
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let address = document.getElementById('address');

    getDocs(contactInfoRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            email.innerHTML = doc.data().email;
            phone.innerHTML = doc.data().phone;
            address.innerHTML = doc.data().address;
        });
    });
})

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