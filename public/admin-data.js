import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc, updateDoc,  } from './firebase.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

//cloud storage
const storage = getStorage();

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
const welcomeImg = document.getElementById('welcome-img');
const welcomeInput = document.getElementById('welcome-img-input');

//html content elements
let contentId;
const contentImg = document.getElementById('content-img');
const photoContainer = document.getElementById('grid');
const contentVideo = document.getElementById('content-video');

//html about elements
let aboutId;
const aboutText = document.getElementById('about-text');
const aboutSubmit = document.getElementById('about-submit');
const aboutLoader = document.getElementById('about-loader');
const aboutInput = document.getElementById('about-img-input');
const aboutImg = document.getElementById('about-img');

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
const serviceImg = document.getElementById('service-img');
const serviceInput = document.getElementById('service-img-input');

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
const videosRef = collection(db, 'videos');
const photosRef = collection(db, 'photos');
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
    document.getElementById('messages-table').style.display = "none";
    document.getElementById('content').style.display = "none";
});

contentPage.addEventListener('click', (e) => {
    document.getElementById('content').style.display = "block";
    document.getElementById('page-elements').style.display = "none";
    document.getElementById('rezervation-table').style.display = "none";
    document.getElementById('messages-table').style.display = "none";
});

reservations.addEventListener('click', (e) => {
   document.getElementById('rezervation-table').style.display = "block";
   document.getElementById('page-elements').style.display = "none";
   document.getElementById('messages-table').style.display = "none"; 
   document.getElementById('content').style.display = "none";
});

messagesPage.addEventListener('click', (e) => {
    document.getElementById('messages-table').style.display = "block";
    document.getElementById('page-elements').style.display = "none";
    document.getElementById('rezervation-table').style.display = "none";
    document.getElementById('content').style.display = "none";
});

//welcome data
onSnapshot(welcomeRef, () => {
    
    getDocs(welcomeRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            welcomeId = doc.id;
            welcomeName.innerHTML = doc.data().name;
            welcomeService.innerHTML = doc.data().service;
            welcomeText.innerHTML = doc.data().text;
            welcomeImg.src = doc.data().img;
        })
    });
});




//update welcome data with image
welcomeSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    welcomeLoader.style.display = "block";
    var ref = doc(db, "welcome-data", welcomeId);
    var file = welcomeInput.files[0];
    var storageRef = sRef(storage, 'welcome-img/' + file.name);
    var uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
        }
    }, function(error) {
        console.log(error);
    }, function() {
        getDownloadURL(uploadTask.snapshot.ref).then(function(downloadURL) {
            console.log('File available at', downloadURL);
            updateDoc(ref, {
                name: welcomeName.value,
                service: welcomeService.value,
                text: welcomeText.value,
                img: downloadURL
            }).then(() => {
                welcomeLoader.style.display = "none";
            }).catch((error) => {
                welcomeLoader.style.display = "none";
                swal({
                    title: "Prosím prihláste sa",
                    icon: "warning",
                    button: "OK",
                });
            });
        });
    });
});


//about data
onSnapshot(aboutRef, () => {
    getDocs(aboutRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            aboutId = doc.id;
            tinymce.get('about-text').setContent(doc.data().text);
            aboutImg.src = doc.data().img;
        });
    });
});

//update about data with image
aboutSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    aboutLoader.style.display = "block";
    var ref = doc(db, "about-data", aboutId);
    var file = aboutInput.files[0];
    var storageRef = sRef(storage, 'about-img/' + file.name);
    var uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
        }
    }, function(error) {
        console.log(error);
    }, function() {
        getDownloadURL(uploadTask.snapshot.ref).then(function(downloadURL) {
            console.log('File available at', downloadURL);
            updateDoc(ref, {
                text: tinymce.get('about-text').getContent(),
                img: downloadURL
            }).then(() => {
                aboutLoader.style.display = "none";
            }).catch((error) => {
                aboutLoader.style.display = "none";
                swal({
                    title: "Prosím prihláste sa",
                    icon: "warning",
                    button: "OK",
                });
            });
        });
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
    serviceImg.src = services[0].img;
    serviceId = serviceIds[0];

    serviceSelect.addEventListener('change', (e) => {
        let selected = services.find(service => service.name === e.target.value);
        serviceName.innerHTML = selected.name;
        serviceText.innerHTML = selected.text;
        servicePrice.innerHTML = selected.price;
        serviceImg.src = selected.img;
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
                title: "Prosím prihláste sa",
                icon: "warning",
                button: "OK",
            })
        });
})

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
            title: "Prosím prihláste sa",
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

//add service data with image
serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sLoader = document.getElementById('s-loader');
    const name = document.getElementById('name');
    const text = document.getElementById('detail');
    const price = document.getElementById('price');
    const serviceFormInput = document.getElementById('service-form-input');
    sLoader.style.display = "block";
    var file = serviceFormInput.files[0];
    var storageRef = sRef(storage, 'service-img/' + file.name);
    var uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
        }
    }
    , function(error) {
        console.log(error);
    }
    , function() {
        getDownloadURL(uploadTask.snapshot.ref).then(function(downloadURL) {
            console.log('File available at', downloadURL);
            addDoc(serviceRef, {
                name: name.value,
                text: text.value,
                price: price.value,
                img: downloadURL
            }).then(() => {
                sLoader.style.display = "none";
                window.location.reload();
            }).catch((error) => {
                sLoader.style.display = "none";
                swal({
                    title: "Prosím prihláste sa",
                    icon: "warning",
                    button: "OK",
                });
            });
        });
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
                title: "Prosím prihláste sa",
                icon: "warning",
                button: "OK",
            })
        });
});


//gallery data
let gallery = [];
let galleryIds = [];
onSnapshot(photosRef, (querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
        gallery.push({ ...doc.data() });
        galleryIds.push(doc.id);
    });
    photoContainer.innerHTML = gallery.map( image => `
    <div class="column">
        <img src="${image.img}" alt="photo" class="photo" style="">
        <button class="button" style="width: 78px; height:auto;" id="delete__button--${galleryIds[gallery.indexOf(image)]}">Vymazať</button>
    </div>
    `).join('');
});

//delete photo
photoContainer.addEventListener('click', async (e) => {
    e.preventDefault();
    if(e.target.id.includes('delete__button--')){
        const id = e.target.id.split('--')[1];
        var ref = doc(db, "photos", id);
        console.log(id);
        await deleteDoc(ref).then(() => {
            window.location.reload();
            console.log('deleted' + id);
        }).catch((error) => {
            swal({
                title: "Prosím prihláste sa",
                icon: "warning",
                button: "OK",
            })
        });
    }
});

//add photo to firebase storage and url to firestore
var imgFiles = [];
var reader = new FileReader();
const photoInput = document.getElementById('imageInput');
const imgPreview = document.getElementById('img-preview');
const imgProgress = document.getElementById('imgProgress');
const photoSubmit = document.getElementById('upload-photo');
const photoName = document.getElementById('photo-name');
const photoExt = document.getElementById('photo-ext');

photoInput.onchange = function(e){
    imgFiles = e.target.files;
    reader.readAsDataURL(imgFiles);

    var name = getName(imgFiles);
    photoName.value = name;
    console.log(name);

    var ext = getFileExt(imgFiles);
    photoExt.value = ext;
    console.log(ext);
}

reader.onload = function(){
    imgPreview.src = reader.result;
}

function getFileExt(file){
    var temp = file.name.split('.');
    var ext = temp[temp.length - 1];

    return "." + ext;
}

function getName(file){
    var temp = file.name.split('.');
    var fname = temp.slice(0, temp.length - 1).join('.');

    return fname;
}

async function uploadProcess(){
    var imagesToUpload = imgFiles;

    var img = photoName.value + photoExt.value;

    const metaData = {
        contentType: imagesToUpload.type
    }

    
    const storageRef = sRef(storage, 'images/' + img);

    const uploadTask = uploadBytesResumable(storageRef, imagesToUpload, metaData);

    uploadTask.on('state_changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        imgProgress.value = 'Upload ' + progress + '%';
    }, (error) => {
        console.log(error);
    }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            addDoc(photosRef, {
                img: downloadURL
            }).then(() => {
                window.location.reload();
            }).catch((error) => {
                swal({
                    title: "Prosím prihláste sa",
                    icon: "warning",
                    button: "OK",
                })
            });
        });
    });
}

photoSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    uploadProcess();
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
                <label class="rezervation__label">Telefón:</label>
                <p class="rezervation__date">${rezervation.phone}</p>
                <label class="rezervation__label">Správa:</label>
                <p class="rezervation__time">${rezervation.message}</p>
                <label class="rezervation__label">Dátum:</label>
                <p class="rezervation__service">${rezervation.date}</p>
            </article>
            <article class="rezervation__buttons">
                <button class="rezervation__button" id="rezervation__button--${rezervationIds[rezervations.indexOf(rezervation)]}">Potvrdiť</button>
                <button class="rezervation__button" id="reservation__button--${rezervationIds[rezervations.indexOf(rezervation)]}">Zmazať</button>
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
                title: "Prosím prihláste sa",
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
                <label class="message__label">Telefón:</label>
                <p class="message__phone">${message.phone}</p>
                <label class="message__label">Správa:</label>
                <p class="message__message">${message.message}</p>
            </article>
            <article class="message__buttons">
                <button class="message__button" id="message__button--${messageIds[messages.indexOf(message)]}">Zmazať</button>
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
                title: "Prosím prihláste sa",
                icon: "warning",
                button: "OK",
            })
        });
    }
});

//upload service image

var fileText = document.getElementById('fileText');
var uploadPercentage = document.getElementById('uploadPercentage');
var percentVal;
var fileItem;
var fileName;
function getFile(e){
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    fileText.innerHTML = fileName;
}

const butt = document.getElementById('upload');
