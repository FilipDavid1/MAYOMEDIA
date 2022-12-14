import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from './firebase.js';

//html aside elements
const page = document.getElementById('page');
const contentPage = document.getElementById('content-page');
const reservations = document.getElementById('reservations');
const messagesPage = document.getElementById('messages');

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
const serviceDelete = document.getElementById('service-delete');
const serviceAdd = document.getElementById('service-add');
const serviceLoader = document.getElementById('service-loader');
const serviceForm = document.getElementById('service-form');

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
const rezervationRef = collection(db, 'events');
const messagesRef = collection(db, 'contact');

//html rezervation elements
let rezervationId;
const rezervationTable = document.getElementById('rezervation-table');

//html messages elements
let messageId;
const messageTable = document.getElementById('messages-table');

//switch pages
page.addEventListener('click', (e) => {
    document.getElementById('page-elements').style.display = "block";
    document.getElementById('rezervation-table').style.display = "none";
});

// contentPage.addEventListener('click', (e) => {
//     page.style.display = "none";
//     contentPage.style.display = "block";
//     reservations.style.display = "none";
//     messages.style.display = "none";
// });

reservations.addEventListener('click', (e) => {
   document.getElementById('rezervation-table').style.display = "block";
   document.getElementById('page-elements').style.display = "none";
});

messagesPage.addEventListener('click', (e) => {
    document.getElementById('messages-table').style.display = "block";
    document.getElementById('page-elements').style.display = "none";
    document.getElementById('rezervation-table').style.display = "none";
});

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
        }).catch((error) => {
            welcomeLoader.style.display = "none";
            swal({
                title: "Pros??m prihl??ste sa",
                icon: "warning",
                button: "OK",
            })
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
        }).catch((error) => {
            aboutLoader.style.display = "none";
            swal({
                title: "Pros??m prihl??ste sa",
                icon: "warning",
                button: "OK",
            })
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
        }).catch((error) => {
            serviceLoader.style.display = "none";
            swal({
                title: "Pros??m prihl??ste sa",
                icon: "warning",
                button: "OK",
            })
        });
});

//delete service
serviceDelete.addEventListener('click', async (e) => {
    e.preventDefault();
    serviceLoader.style.display = "block";
    var ref = doc(db, "services", serviceId);
    await deleteDoc(ref).then(() => {
        serviceLoader.style.display = "none";
        window.location.reload();
    }).catch((error) => {
        serviceLoader.style.display = "none";
        swal({
            title: "Pros??m prihl??ste sa",
            icon: "warning",
            button: "OK",
        })
    });
});

//add service
const content = document.getElementById('page');
serviceAdd.addEventListener('click', async (e) => {
    e.preventDefault();

    
    
    if(serviceForm.style.display === 'none' || serviceForm.style.display === ''){
        //show form with animation

        serviceForm.style.display = 'block';
        content.style.opacity = 0.5;
    }
    else{
        serviceForm.style.display = 'none';
        content.style.opacity = 1;
    }
});

serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sLoader = document.getElementById('s-loader');
    const name = document.getElementById('name');
    const text = document.getElementById('detail');
    const price = document.getElementById('price');
    sLoader.style.display = "block";
    await addDoc(serviceRef, {
        name: name.value,
        text: text.value,
        price: price.value
        }).then(() => {
            sLoader.style.display = "none";
            serviceForm.style.display = 'none';
            content.style.opacity = 1;
        }).catch((error) => {
            sLoader.style.display = "none";
            swal({
                title: "Pros??m prihl??ste sa",
                icon: "warning",
                button: "OK",
            })
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
        }).catch((error) => {
            contactLoader.style.display = "none";
            swal({
                title: "Pros??m prihl??ste sa",
                icon: "warning",
                button: "OK",
            })
        });
});


//rezervations data
let rezervations = [];
let rezervationIds = [];
onSnapshot(rezervationRef, (querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
        rezervations.push({ ...doc.data() });
        rezervationIds.push(doc.id);
    });
    rezervationTable.innerHTML = rezervations.map( rezervation => `
        <section class="rezervation">
            <article class="rezervation__info">
                <h2 class="rezervation__name">${rezervation.service}</h2>
                <label class="rezervation__label">Meno:"</label>
                <p class="rezervation__phone">${rezervation.name}</p>
                <label class="rezervation__label">Email:</label>
                <p class="rezervation__email">${rezervation.email}</p>
                <label class="rezervation__label">Telef??n:</label>
                <p class="rezervation__date">${rezervation.phone}</p>
                <label class="rezervation__label">Spr??va:</label>
                <p class="rezervation__time">${rezervation.message}</p>
                <label class="rezervation__label">D??tum:</label>
                <p class="rezervation__service">${rezervation.date}</p>
            </article>
            <article class="rezervation__buttons">
                <button class="rezervation__button" id="rezervation__button--${rezervationIds[rezervations.indexOf(rezervation)]}">Potvrdi??</button>
                <button class="rezervation__button" id="reservation__button--${rezervationIds[rezervations.indexOf(rezervation)]}">Zmaza??</button>
            </article>
        </section>
    `).join('');
});

//delete rezervation
rezervationTable.addEventListener('click', async (e) => {
    if(e.target.classList.contains('rezervation__button')){
        let id = e.target.id.split('--')[1];
        var ref = doc(db, "events", id);
        await deleteDoc(ref).then(() => {
            //reload data
            window.location.reload();
        }).catch((error) => {
            swal({
                title: "Pros??m prihl??ste sa",
                icon: "warning",
                button: "OK",
            })
        });
    }
});

//message data
let messages = [];
let messageIds = [];
onSnapshot(messagesRef, (querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
        messages.push({ ...doc.data() });
        messageIds.push(doc.id);
    });
    messageTable.innerHTML = messages.map( message => `
        <section class="message">
            <article class="message__info">
                <h2 class="message__name">${message.name}</h2>
                <label class="message__label">Email:</label>
                <p class="message__email">${message.email}</p>
                <label class="message__label">Telef??n:</label>
                <p class="message__phone">${message.phone}</p>
                <label class="message__label">Spr??va:</label>
                <p class="message__message">${message.message}</p>
            </article>
            <article class="message__buttons">
                <button class="message__button" id="message__button--${messageIds[messages.indexOf(message)]}">Zmaza??</button>
            </article>
        </section>
    `).join('');
});

//delete message
messageTable.addEventListener('click', async (e) => {
    if(e.target.classList.contains('message__button')){
        let id = e.target.id.split('--')[1];
        var ref = doc(db, "contact", id);
        await deleteDoc(ref).then(() => {
            //reload data
            window.location.reload();
        }).catch((error) => {
            swal({
                title: "Pros??m prihl??ste sa",
                icon: "warning",
                button: "OK",
            })
        });
    }
});