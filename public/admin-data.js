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
            data.img= downloadURL;
            docMethod(ref, data)
                .then(() => {
                    loader.style.display = "none";
                }).catch((error) => {
                    loader.style.display = "none";
                    swal({
                        title: "Prosím prihláste sa",
                        icon: "error",
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
                icon: "error",
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
            icon: "error",
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
                icon: "error",
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
        await deleteDoc(ref).then(() => {
            window.location.reload();
        }).catch((error) => {
            swal({
                title: "Prosím prihláste sa",
                icon: "error",
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
        var ref = doc(db, "videos", id);
        await deleteDoc(ref).then(() => {
            window.location.reload();
        }).catch((error) => {
            swal({
                title: "Prosím prihláste sa",
                icon: "error",
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
            icon: "error",
            button: "OK",
        })
    });
});


//rezervations data
let rezervations = [];
let rezervationIds = [];
onSnapshot(rezervationRef, (querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
        //add only if not confirmed
        if(doc.data().confirmed == false ){
        rezervations.push({ ...doc.data() });
        rezervationIds.push(doc.id);
        }
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
                <label class="rezervation__label">Cena:</label>
                <p class="rezervation__service">${rezervation.price}</p>
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
            //send email
            Email.send({   
                SecureToken: "4724d794-83ea-4e48-98f1-bac030137e0b",
                To : rezervations[rezervationIds.indexOf(id)].email,
                From : "filipenkodavid@gmail.com",
                Subject : "Zamietnutie rezervácie",
                Body : "Vaša rezervácia bola zamietnutá"
            }).then(
                message => {
                    console.log(message);
                    window.location.reload();
                }
            );
        }).catch((error) => {
            swal({
                title: "Prosím prihláste sa",
                icon: "error",
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
            //send email
            Email.send({
                SecureToken: "4724d794-83ea-4e48-98f1-bac030137e0b",
                To : rezervations[rezervationIds.indexOf(id)].email,
                From : "filipenkodavid@gmail.com",
                Subject : "Potvrdenie rezervácie",
                //add name to body
                Body : `<!DOCTYPE html>

                <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                <head>
                <title></title>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
                <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
                <style>
                        * {
                            box-sizing: border-box;
                        }
                
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: black !important;
                            color: #fff !important;
                        }
                
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: inherit !important;
                        }
                
                        #MessageViewBody a {
                            color: inherit;
                            text-decoration: none;
                        }
                
                        p {
                            line-height: inherit
                        }
                
                        .desktop_hide,
                        .desktop_hide table {
                            mso-hide: all;
                            display: none;
                            max-height: 0px;
                            overflow: hidden;
                        }
                
                        @media (max-width:520px) {
                            .desktop_hide table.icons-inner {
                                display: inline-block !important;
                            }
                
                            .icons-inner {
                                text-align: center;
                            }
                
                            .icons-inner td {
                                margin: 0 auto;
                            }
                
                            .row-content {
                                width: 100% !important;
                            }
                
                            .mobile_hide {
                                display: none;
                            }
                
                            .stack .column {
                                width: 100%;
                                display: block;
                            }
                
                            .mobile_hide {
                                min-height: 0;
                                max-height: 0;
                                max-width: 0;
                                overflow: hidden;
                                font-size: 0px;
                            }
                
                            .desktop_hide,
                            .desktop_hide table {
                                display: table !important;
                                max-height: none !important;
                            }
                        }
                    </style>
                </head>
                <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;text-align:center;">
                <h1 style="margin: 0; color: #555555; font-size: 23px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;">${rezervations[rezervationIds.indexOf(id)].name}, S radosťou potvrdzujeme, že poskytneme služby kameramana pre váš špeciálny deň.</h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad">
                <div style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                <p style="margin: 0;">Dodatočné informácie:</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="list_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad">
                <ul style="margin: 0; padding: 0; margin-left: 20px; list-style-type: revert; color: #000000; font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-weight: 400; line-height: 120%; text-align: left; direction: ltr; letter-spacing: 0px;">
                <li style="margin-bottom: 0px;">Miesto konania: </li>
                <li style="margin-bottom: 0px;">Dátum konania: ${rezervations[rezervationIds.indexOf(id)].date}</li>
                <li>Cena: ${rezervations[rezervationIds.indexOf(id)].price}€</li>
                </ul>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad">
                <div align="center" class="alignment">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>
                </tr>
                </table>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad">
                <div style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                <p style="margin: 0; margin-bottom: 16px;">Pre ďalšie otázky ma neváhajte kontaktovať</p>
                <p style="margin: 0; margin-bottom: 16px;">Kontaktná osoba: Mayo Dávid</p>
                <p style="margin: 0; margin-bottom: 16px;">Kontaktné číslo: +421 908 253 293</p>
                <p style="margin: 0;">Email:  <a href="mailto:gifot65349@fom8.com?subject=Otázky k rezervácií ">Pošlite mi email</a></p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad">
                <div align="center" class="alignment">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>
                </tr>
                </table>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad">
                <div style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
                <p style="margin: 0; margin-bottom: 16px;">Prosím, dajte nám vedieť, ak sú tu akékoľvek zmeny alebo ak máte nejaké špeciálne požiadavky na vaše svadobné video.</p>
                <p style="margin: 0;">Tešíme sa na zachytenie špeciálnych okamihov vášho veľkého dňa!</p>
                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="alignment" style="vertical-align: middle; text-align: center;">
                <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                <!--[if !vml]><!-->
                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                <!--<![endif]-->
                
                </table>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table><!-- End -->
                </body>
                </html>`
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
                icon: "error",
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
                icon: "error",
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
