import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from './firebase.js';

//html welcome elements
let welcomeId;
const welcomeName = document.getElementById('welcome-name');
const welcomeService = document.getElementById('welcome-service');
const welcomeText = document.getElementById('welcome-text');
const welcomeSubmit = document.getElementById('welcome-submit');
const welcomeLoader = document.getElementById('welcome-loader');

//html about elements
let aboutId;
const aboutText = document.getElementById('about-text');
const aboutSubmit = document.getElementById('about-submit');
const aboutLoader = document.getElementById('about-loader');

//html services elements
let serviceId;
const serviceSelect = document.getElementById('service-select');
const serviceName = document.getElementById('service-name');
const serviceText = document.getElementById('service-text');
const servicePrice = document.getElementById('service-price');
const serviceSubmit = document.getElementById('service-submit');
const serviceLoader = document.getElementById('service-loader');

//html contact elements
let contactId;
const address = document.getElementById('address');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const contactSubmit = document.getElementById('contact-submit');
const contactLoader = document.getElementById('contact-loader');

//collection reference
const welcomeRef = collection(db, 'welcome-data' );
const aboutRef = collection(db, 'about-data');
const serviceRef = collection(db, 'services');
const contactRef = collection(db, 'contact-info');

//welcome data
onSnapshot(welcomeRef, () => {
    
    getDocs(welcomeRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            welcomeId = doc.id;
            welcomeName.innerHTML = doc.data().name;
            welcomeService.innerHTML = doc.data().service;
            welcomeText.innerHTML = doc.data().text;
        })
    });
});

//update welcome data
welcomeSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    welcomeLoader.style.display = "block";
    var ref = doc(db, "welcome-data", welcomeId);
    await updateDoc(ref, {
        name: welcomeName.value,
        service: welcomeService.value,
        text: welcomeText.value
        }).then(() => {
            welcomeLoader.style.display = "none";
        });
});


//about data
onSnapshot(aboutRef, () => {
    getDocs(aboutRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            aboutId = doc.id;
            aboutText.innerHTML = doc.data().text;
        });
    });
});

//update about data
aboutSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    aboutLoader.style.display = "block";
    var ref = doc(db, "about-data", aboutId);
    await updateDoc(ref, {
        text: aboutText.value
        }).then(() => {
            aboutLoader.style.display = "none";
        });
});

//services data
let services = [];
let serviceIds = [];
onSnapshot(serviceRef, (querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
        services.push({ ...doc.data() });
        serviceIds.push(doc.id);
    });
    serviceSelect.innerHTML = services.map(service => `<option value="${service.name}">${service.name}</option>`).join('');
    serviceName.innerHTML = services[0].name;
    serviceText.innerHTML = services[0].text;
    servicePrice.innerHTML = services[0].price;
    serviceId = serviceIds[0];

    serviceSelect.addEventListener('change', (e) => {
        let selected = services.find(service => service.name === e.target.value);
        serviceName.innerHTML = selected.name;
        serviceText.innerHTML = selected.text;
        servicePrice.innerHTML = selected.price;
        serviceId = serviceIds[services.indexOf(selected)];
    });
});

//update services data
serviceSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    serviceLoader.style.display = "block";
    var ref = doc(db, "services", serviceId);
    await updateDoc(ref, {
        name: serviceName.value,
        text: serviceText.value,
        price: servicePrice.value
        }).then(() => {
            serviceLoader.style.display = "none";
        });
});

//contact data
onSnapshot(contactRef, () => {
    getDocs(contactRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            contactId = doc.id;
            address.innerHTML = doc.data().address;
            phone.innerHTML = doc.data().phone;
            email.innerHTML = doc.data().email;
        });
    });
});

//update contact data
contactSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    contactLoader.style.display = "block";
    var ref = doc(db, "contact-info", contactId);
    await updateDoc(ref, {
        address: address.value,
        phone: phone.value,
        email: email.value
        }).then(() => {
            contactLoader.style.display = "none";
        });
});
