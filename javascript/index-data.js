import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';


//collection reference
const welcomeRef = collection(db, 'welcome-data');
const aboutRef = collection(db, 'about-data');
const serviceRef = collection(db, 'services');

//welcome data
let welcomeData = [];
onSnapshot(welcomeRef, (querySnapshot) => {
    let nameW = document.getElementById('name-welcome');  
    let servicesW = document.getElementById('service-w');
    let textW = document.getElementById('text-welcome');

    querySnapshot.docs.forEach((doc) =>{
        welcomeData.push({ ...doc.data() })
    })
    nameW.innerHTML = welcomeData[0].name;
    servicesW.innerHTML = welcomeData[0].service;
    textW.innerHTML = welcomeData[0].text;
})

//about data
onSnapshot(aboutRef, () =>{
    let textA = document.getElementById('text-about');

    getDocs(aboutRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            textA.innerHTML = doc.data().text;
        });
    });
})

// foreach service data in card container
let services = [];
onSnapshot(serviceRef, (querySnapshot) => {
    let cardContainer = document.getElementById('card-container');
    querySnapshot.docs.forEach((doc) =>{
        services.push({ ...doc.data() })
    })
    cardContainer.innerHTML = services.map(service => `
    <div class="card">
        <div class="card-text">
            <h3>${service.name}</h3>
        <div class="flex">
            <img src="${service.img}" alt="service image" class="card-images" style="padding-bottom: 1em;">
            <button class="button" id="reserve">Detail</button>
        </div>
        </div>
    </div>`).join('');
})