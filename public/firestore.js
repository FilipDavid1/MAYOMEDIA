
import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';

//html elements
const bookingForm = document.getElementById('booking-form');
const credentialsForm = document.getElementById('credentials-form');
const form = document.getElementById('form');

//collection reference
const colRef = collection(db, 'services');
const eventRef = collection(db, 'events');
//real time collection data

let services = [];
onSnapshot(colRef, (querySnapshot) => {
    
    let select = document.getElementById('select');
    let price = document.getElementById('price');
    let priceM = document.getElementById('price-m');
    let img = document.getElementById('img');
    let name = document.getElementById('service-name');
    let serviceText = document.getElementById('service-text');
    let button = document.getElementById('submit');
        querySnapshot.docs.forEach((doc) =>{
            services.push({ ...doc.data() })
        })
        price.innerHTML = 'Cena: ' + services[0].price + '€';
        priceM.innerHTML = 'Cena: ' + services[0].price + '€';

        img.src = services[0].img;
        name.innerHTML = services[0].name;
        serviceText.innerHTML = services[0].text;
        select.innerHTML = services.map(service => `<option value="${service.name}">${service.name}</option>`).join('');

        select.addEventListener('change', (e) => {
            let selected = services.find(service => service.name === e.target.value);
            
            price.innerHTML = 'Cena: ' + selected.price + '€';
            priceM.innerHTML = 'Cena: ' + selected.price + '€';
        
            img.src = selected.img;
            name.innerHTML = selected.name;
            serviceText.innerHTML = selected.text;
        })
});




bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const content = document.getElementById('services-content');
    
    if(credentialsForm.style.display === 'none' || credentialsForm.style.display === ''){
        //show form with animation

        credentialsForm.style.display = 'block';
        content.style.opacity = 0.5;
    }
    else{
        credentialsForm.style.display = 'none';
        content.style.opacity = 1;
    }
});

credentialsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let selected = services.find(service => service.name === select.value);
    let name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let date = document.getElementById('cal').value;
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;
    let data = {
        name,
        phone,
        date,
        email,
        message,
        service: selected.name,
    }
    credentialsForm.style.display = 'none';
    content.style.opacity = 1;

    //add data to firestore
    addDoc(eventRef, data);
    
    swal({
        title: "Rezervácia bola úspešná",
        icon: "success",
        button: "OK",
    })
})

// add data
// const testForm = document.querySelector('.testForm');
// testForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     addDoc(colRef, {
//         name: testForm.name.value,
//         lastName: testForm.lastName.value,
//     })
//     .then(() => {
//         testForm.reset();
//     })
// })

// // delete data
// const testDeleteForm = document.querySelector('.deleteForm');
// testDeleteForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     deleteDoc(doc(db, "test", testDeleteForm.id.value));
//     testDeleteForm.reset();
// });