import { db, collection, getDocs, onSnapshot, auth} from './firebase.js';


//collection reference
const welcomeRef = collection(db, 'welcome-data');
const aboutRef = collection(db, 'about-data');
const serviceRef = collection(db, 'services');
const photosRef = collection(db, 'photos');
const videoRef = collection(db, 'videos');

//welcome data
let welcomeData = [];
onSnapshot(welcomeRef, (querySnapshot) => {
    let nameW = document.getElementById('name-welcome');  
    let servicesW = document.getElementById('service-w');
    let welcomeImg = document.getElementById('welcome-img-img');
    // let textW = document.getElementById('text-welcome');

    querySnapshot.docs.forEach((doc) =>{
        welcomeData.push({ ...doc.data() })
    })
    nameW.innerHTML = welcomeData[0].name;
    servicesW.innerHTML = welcomeData[0].service;
    welcomeImg.src = welcomeData[0].img;
    // textW.innerHTML = welcomeData[0].text;
})

//about data
// onSnapshot(aboutRef, () =>{
//     let textA = document.getElementById('text-about');

//     getDocs(aboutRef).then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             textA.innerHTML = doc.data().text;
//         });
//     });
// })

auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      onSnapshot(aboutRef, () =>{
        let textA = document.getElementById('text-about');
        let aboutImg = document.getElementById('about-img-img');

        getDocs(aboutRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                textA.innerHTML = doc.data().text;
                aboutImg.src = doc.data().img;
            });
        });
    })
      // ...
    } else {
      // User is signed out
      console.log("User is signed out");
      textA.innerHTML = "Please login to view this content";
      // ...
    }
  });

// // foreach service data in card container
// let services = [];
// onSnapshot(serviceRef, (querySnapshot) => {
//     let cardContainer = document.getElementById('card-container');
//     querySnapshot.docs.forEach((doc) =>{
//         services.push({ ...doc.data() })
//     })
//     cardContainer.innerHTML = services.map(service => `
//     <div class="card">
//         <div class="card-text">
//             <h3>${service.name}</h3>
//         <div class="flex">
//             <img src="${service.img}" alt="service image" class="card-images" style="padding-bottom: 1em;">
//             <button class="button" id="reserve" onclick="location.href='./services.html'">Detail</button>
//         </div>
//         </div>
//     </div>`).join('');

    

//     //cards for mobile
//     let cardContainerM = document.getElementById('slides-container');
//     cardContainerM.innerHTML = services.map(service => `
//     <li class="slide">
//         <div class="card">
//             <div class="card-text">
//                 <h3>${service.name}</h3>
//             <div class="flex">
//                 <img src="${service.img}" alt="service image" class="card-images" style="padding-bottom: 1em; max-width="300px"">
//                 <button class="button" id="reserve" onclick="location.href='./services.html'">Detail</button>
//             </div>
//             </div>
//         </div>
//     </li>`).join('');
// })

//     const slidesContainer = document.getElementById("slides-container");
//     const slide = document.querySelector(".slide");
//     const prevButton = document.getElementById("slide-arrow-prev");
//     const nextButton = document.getElementById("slide-arrow-next");
//     const testOfS = document.getElementById('slides-container');

//     let slideWidth = 0;
//     nextButton.addEventListener("click", () => {
//         slideWidth = testOfS.offsetWidth;
//     slidesContainer.scrollLeft += slideWidth;
//     });

//     prevButton.addEventListener("click", () => {
//         slideWidth = testOfS.offsetWidth;
//     slidesContainer.scrollLeft -= slideWidth;
//     });

//photos data
document.addEventListener("DOMContentLoaded", function(){
    let photos = [];
    const gallery = document.getElementById('gallery');

    onSnapshot(photosRef, (querySnapshot) => {
        querySnapshot.docs.forEach((doc) =>{
            photos.push({ ...doc.data() });
        });
        gallery.innerHTML = photos.map(photo => `
        <a href="${photo.img}" data-lightbox="wedding">
            <img src="${photo.img}" alt="photo">
        </a>
            
        `).join('');       
    });
});





//generate vimeo iframe
function generateIframe(vimeoLink) {
    var videoId = vimeoLink.split("/").pop().split("?")[0];
    var iframe = document.createElement("iframe");
    iframe.src = "https://player.vimeo.com/video/" + videoId;
    iframe.width = "1080";
    iframe.height = "720";
    iframe.frameborder = "0";
    iframe.allow = "autoplay; fullscreen";
    return iframe;
  }
  
  

//video data
let videos = [];
let currentIndex = 0;
let videoContainer = document.getElementById('video-carousel');

onSnapshot(videoRef, (querySnapshot) => {
    querySnapshot.docs.forEach((doc) =>{
        videos.push({ ...doc.data() })
    });
    
    for (let i = 0; i < videos.length; i++) {
        try {
            let iframe = generateIframe(videos[i].src);
            let videoSlide = document.createElement("div");
            videoSlide.className = "video-slide";
            videoSlide.appendChild(iframe);
            videoContainer.appendChild(videoSlide);
        } catch (error) {
            console.error(error);
            let errorDiv = document.createElement("div");
            errorDiv.className = "error";
            errorDiv.innerHTML = `Error: ${error.message}`;
            videoContainer.appendChild(errorDiv);
        }
    }

    let videoSlides = videoContainer.getElementsByClassName('video-slide');
    for (let i = 0; i < videoSlides.length; i++) {
        videoSlides[i].style.display = "none";
    }
    videoSlides[currentIndex].style.display = "flex";

    function showSlide(n) {
        videoSlides[currentIndex].style.display = "none";
        currentIndex = (n + videos.length) % videos.length;
        videoSlides[currentIndex].style.display = "flex";
    }
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    document.getElementById("next").onclick = nextSlide;
    document.getElementById("prev").onclick = prevSlide;
});
     





