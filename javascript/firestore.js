import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';

//collection reference
const colRef = collection(db, 'services');

//real time collection data
onSnapshot(colRef, (querySnapshot) => {
    let services = [];
    let select = document.getElementById('select');
    let price = document.getElementById('price');
    let img = document.getElementById('img');
    let name = document.getElementById('service-name');
        querySnapshot.docs.forEach((doc) =>{
            services.push({ ...doc.data() })
        })
        select.innerHTML = services.map(service => `<option value="${service.name}">${service.name}</option>`).join('');

        select.addEventListener('change', (e) => {
            let selected = services.find(service => service.name === e.target.value);
            if(selected.price === undefined){
                price.innerHTML = '';
            }
            price.innerHTML = selected.price + '€';
            img.src = selected.img;
            name.innerHTML = selected.name;
        })
});


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