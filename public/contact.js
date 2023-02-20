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
    e.preventDefault();
    //check if all fields are filled
    if (form.email.value == "" || form.name.value == "" || form.phone.value == "" || form.message.value == "") {
        swal({
            title: "Prosím vyplňte všetky polia",
            icon: "error",
            button: "OK",
        })
        //else send data to firestore
    } else {
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
    }
})

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', function() {
      let selectedText = item.querySelector('p').innerText;
      let textArea = document.createElement("textarea");
      textArea.value = selectedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
  
      // Display a gif and message after copy
      
      item.innerHTML += '<p>Skopirovane</p>';
  
      // Revert back to original text after 2 seconds with smooth transition
      setTimeout(function() {
        item.style.opacity = 0;
        setTimeout(function() {
          item.innerHTML = '<img src="' + item.querySelector('img').src + '"/>';
          item.innerHTML += '<p>' + selectedText + '</p>';
          item.style.opacity = 1;
        }, 500);
      }, 2000);
    });
  });

  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', function() {
      let selectedText = item.querySelector('p').innerText;
      let imageSrc = item.querySelector('img').src;
      let textArea = document.createElement("textarea");
      textArea.value = selectedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      console.log("Copied to clipboard: " + selectedText);
  
      // Display a gif and message after copy
      
      item.innerHTML += '<p></p>';
  
          // Display a gif and message after copy
    let copiedMessage = "Skopirovane";
    if (selectedText.includes("@")) {
      copiedMessage = "Email bol skopírovaný";
    } else if (selectedText.includes("+")) {
      copiedMessage = "Telefónne číslo bolo skopírované";
    } else {
      copiedMessage = "Adresa bola skopírovaná";
    }
    item.innerHTML = '<img src="https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-max-1mb.gif" width="48" height="48"/>';
    item.innerHTML += '<p>' + copiedMessage + '</p>';

      // Revert back to original text after 2 seconds with smooth transition
      setTimeout(function() {
        item.style.opacity = 0;
        setTimeout(function() {
          item.innerHTML = '<img src="' + imageSrc + '"/>';
          item.innerHTML += '<p>' + selectedText + '</p>';
          item.style.opacity = 1;
        }, 500);
      }, 2000);
    });
  });
  