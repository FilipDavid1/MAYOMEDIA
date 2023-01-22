import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc, updateDoc,  } from './firebase.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

//cloud storage
const storage = getStorage();

//html aside elements
const page = document.getElementById('page');
const contentPage = document.getElementById('content-page');
const reservations = document.getElementById('reservations');
const messagesPage = document.getElementById('messages');
const calendarPage = document.getElementById('calendarPage');

//html welcome elements
let welcomeId;
const welcomeName = document.getElementById('welcome-name');
const welcomeService = document.getElementById('welcome-service');
const welcomeText = document.getElementById('welcome-text');
const welcomeSubmit = document.getElementById('welcome-submit');
const welcomeLoader = document.getElementById('welcome-loader');
const welcomeImg = document.getElementById('welcome-img');
const newImg = document.getElementById('new-img');
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

//show elements
function showElement(elementId) {
    const elementIds = ['page-elements', 'rezervation-table', 'messages-table', 'content', 'calendar'];
    elementIds.forEach(id => {
        if (id === elementId) {
            document.getElementById(id).style.display = 'block';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    });
}

page.addEventListener('click', (e) => showElement('page-elements'));
contentPage.addEventListener('click', (e) => showElement('content'));
reservations.addEventListener('click', (e) => showElement('rezervation-table'));
messagesPage.addEventListener('click', (e) => showElement('messages-table'));
calendarPage.addEventListener('click', (e) => showElement('calendar'));

//upload photo
function handleWelcomeUpload(uploadTask, data, docMethod, loader, ref) {
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        swal({
            title: progress + "%",
            text: "Nahrávanie obrázku",
            icon: "info",
        })
        switch (snapshot.state) {
            case 'paused':
                swal({
                    title: "Nahrávanie pozastavené",
                    icon: "warning",
                    button: "OK",
                })
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
            data.img= downloadURL;
            docMethod(ref, data)
                .then(() => {
                    loader.style.display = "none";
                }).catch((error) => {
                    loader.style.display = "none";
                    swal({
                        title: "Prosím prihláste sa",
                        icon: "warning",
                        button: "OK",
                    });
                });
        });
    });
}


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
    var imgName = file.name;
    console.log(imgName);
    var storageRef = sRef(storage, 'welcome-img/' + file.name);
    var uploadTask = uploadBytesResumable(storageRef, file);
    
   const data = {
        name: welcomeName.value,
        service: welcomeService.value,
        text: welcomeText.value,
        img: ""
    }
    handleWelcomeUpload( uploadTask, data, updateDoc, welcomeLoader, ref);


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
    const data = {
        text: tinymce.get('about-text').getContent(),
        img: ""
    }
    handleWelcomeUpload( uploadTask, data, updateDoc, aboutLoader, ref);
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
    const data = {
        name: name.value,
        text: text.value,
        price: price.value,
        img: ""
    }
    handleWelcomeUpload( uploadTask, data, addDoc, sLoader, serviceRef);
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
        console.log(id);
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

const imgProgress = document.getElementById('imgProgress');
const photoSubmit = document.getElementById('upload-photo');
   

photoSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const photoInput = document.getElementById('imageInput');

    var file = photoInput.files[0];
    var storageRef = sRef(storage, 'photos/' + file.name);
    var uploadTask = uploadBytesResumable(storageRef, file);

    const data = {
        img: ""
    }
    handleWelcomeUpload( uploadTask, data, addDoc, imgProgress, photosRef);
    
});

//generate vimeo iframe
function generateIframe(vimeoLink) {
    var videoId = vimeoLink.split("/").pop().split("?")[0];
    var iframe = document.createElement("iframe");
    iframe.src = "https://player.vimeo.com/video/" + videoId;
    iframe.width = "200";
    iframe.height = "";
    iframe.frameborder = "0";
    iframe.allow = "autoplay; fullscreen";
    return iframe;
  }

//generate link from iframe
function generateLink(iframe) {
    var videoId = iframe.split("/").pop().split("?")[0];
    var link = document.createElement("a");
    link.href = "https://vimeo.com/" + videoId;
    link.innerHTML = "https://vimeo.com/" + videoId;
    return link;
}
  
  

//video data
let videos = [];
let videoIds = [];
let videoContainer = document.getElementById('video-container');

onSnapshot(videosRef, (querySnapshot) => {
    querySnapshot.docs.forEach((doc) =>{
        videos.push({ ...doc.data() });
        videoIds.push(doc.id);
    });
    
    for (let i = 0; i < videos.length; i++) {
        try {
            let iframe = generateIframe(videos[i].src);
            let videoSlide = document.createElement("div");
            videoSlide.className = "video-slide";
            videoSlide.appendChild(iframe);
            videoContainer.appendChild(videoSlide);
            //add remove button
            let removeButton = document.createElement("button");
            removeButton.className = "button";
            removeButton.innerHTML = "&#10005;";
            removeButton.id = `delete__button--${videoIds[i]}`;
            videoSlide.appendChild(removeButton);
        } catch (error) {
            console.error(error);
            let errorDiv = document.createElement("div");
            errorDiv.className = "error";
            errorDiv.innerHTML = `Error: ${error.message}`;
            videoContainer.appendChild(errorDiv);

        }
    }
});

//delete video
videoContainer.addEventListener('click', async (e) => {
    e.preventDefault();
    if(e.target.id.includes('delete__button--')){
        const id = e.target.id.split('--')[1];
        console.log(id);
        var ref = doc(db, "videos", id);
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
    

//send video to firestore
const videoSubmit = document.getElementById('upload-video');
videoSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    var video = document.getElementById('video');
    addDoc(videosRef, {
        src: video.value
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
                <button class="rezervation__button button" id="rezervation__button--${rezervationIds[rezervations.indexOf(rezervation)]}">Potvrdiť</button>
                <button class="rezervation__button button" id="reservation__buttond--${rezervationIds[rezervations.indexOf(rezervation)]}">Zmazať</button>
            </article>
        </section>
    `).join('');
});

//delete rezervation
rezervationTable.addEventListener('click', async (e) => {
    if(e.target.classList.contains('rezervation__buttond')){
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

//confirm rezervation and send email
rezervationTable.addEventListener('click', async (e) => {
    e.preventDefault();
    if(e.target.classList.contains('rezervation__button')){
        let id = e.target.id.split('--')[1];
        var ref = doc(db, "events", id);
        await updateDoc(ref, {
            confirmed: true
        }).then(() => {
            console.log('confirmed' + id);
            //send email
            Email.send({
                SecureToken: "4724d794-83ea-4e48-98f1-bac030137e0b",
                To : rezervations[rezervationIds.indexOf(id)].email,
                From : "filipenkodavid@gmail.com",
                Subject : "Potvrdenie rezervácie",
                //add name to body
                Body : `<h1>Congratulations ${rezervations[rezervationIds.indexOf(id)].name} on your upcoming wedding!</h1>
                <p>We are delighted to confirm that we will be providing videography services for your special day.</p>
                <table>
                  <tr>
                    <th>Date</th>
                    <td>${rezervations[rezervationIds.indexOf(id)].date}</td>
                  </tr>
                  <tr>
                    <th>Start Time</th>
                    <td>{{START_TIME}}</td>
                  </tr>
                  <tr>
                    <th>End Time</th>
                    <td>{{END_TIME}}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>{{VENUE_NAME}}</td>
                  </tr>
                  <tr>
                    <th>Contact Person</th>
                    <td>Mayo Dávid</td>
                  </tr>
                  <tr>
                    <th>Contact Number</th>
                    <td>+421 908 253 293</td>
                  </tr>
                </table>
                <p>Please let us know if there are any changes or if you have any special requests for your wedding video.</p>
                <p>We look forward to capturing the special moments of your big day!</p>`
            }).then(

                //token 43171db-5be2-4935-9813-559d62b2ca2d 
                message => {
                    console.log(message);
                    
                }
            );
        }).catch((error) => {
            console.log(error);
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
                <button class="message__button button" id="message__button--${messageIds[messages.indexOf(message)]}">Zmazať</button>
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

//display confirmed rezervations in calendar and disable that day
var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    events: function(info, successCallback, failureCallback) {
        var events = [];
        onSnapshot(rezervationRef, (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                //disable date if confirmed
                if(doc.data().confirmed == true){
                    var data = doc.data();
                    console.log(data);
                    events.push({
                        title: data.service + ' - ' + data.name,
                        start: data.date,
                        allDay: true,
                        backgroundColor: '#AA1A45',
                        borderColor: '#252525',
                });
            }
                
        });
        successCallback(events);
    });
},
    locale: 'sk',
});
calendar.render();
