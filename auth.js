import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBsEPDd_V_oxiA_hfNFFn1n0dOTAdHPscE",
  authDomain: "mayomedia-72317.firebaseapp.com",
  databaseURL: "https://mayomedia-72317-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mayomedia-72317",
  storageBucket: "mayomedia-72317.appspot.com",
  messagingSenderId: "150149852780",
  appId: "1:150149852780:web:3ae4926c3644570c74f249"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

function emailValidation(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(email).toLowerCase())) {
    return true;
  }
  else{
  return false;
  }
}

function passwordValidation(password) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (re.test(String(password))) {
    return true;
  }
  else{
  return false;
  }
}

function passwordMatch(password, password2) {
  if (password === password2) {
    return true;
  }
  else{
  return false;
  }
}




registerBtn.addEventListener("click", (e) => {

  
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var repPassword = document.getElementById('repPassword').value;

  if (emailValidation(email) && passwordValidation(password) && passwordMatch(password, repPassword)) {
    document.getElementById('emailLabel').style.visibility = "hidden";
    document.getElementById('passwordLabel').style.visibility = "hidden";
    document.getElementById('repPasswordLabel').style.visibility = "hidden";
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;


        set(ref(database, 'users/' + user.uid), {
          email: email,
          password: password,
          last_login: Date.now(),
        }).then(() => {
          // Data saved successfully!
          window.location.replace("./signIn.html");
        })
          .catch((error) => {
            // The write failed...

          });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

}
else if (!emailValidation(email)) {
  document.getElementById('emailLabel').style.visibility = "visible";
}
else if (!passwordValidation(password)) {
  document.getElementById('passwordLabel').style.visibility = "visible";
}
else if (!passwordMatch(password, repPassword)) {
  document.getElementById('repPasswordLabel').style.visibility = "visible";
}
else {
  alert("Something went wrong");
}
})


loginBtn.addEventListener("click", (e) => {

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      var lgDate = new Date();

      update(ref(database, 'users/' + user.uid), {
        last_login: lgDate,
      }).then(() => {
        // Data saved successfully!
        window.location.replace("./index.html");
      })
        .catch((error) => {
          // The write failed...
          console.log(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode);
    });
})

