import { db, collection, getDocs, addDoc, onSnapshot } from './firebase.js';

//html elements
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
    console.log(form.email.value, form.name.value, form.phone.value, form.message.value);
    e.preventDefault();
    addDoc(colRef, {
        email: form.email.value,
        name: form.name.value,
        phone: form.phone.value,
        message: form.message.value,
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