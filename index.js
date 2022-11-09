import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, connectAuthEmulator  } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBsEPDd_V_oxiA_hfNFFn1n0dOTAdHPscE",
  authDomain: "mayomedia-72317.firebaseapp.com",
  databaseURL: "https://mayomedia-72317-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mayomedia-72317",
  storageBucket: "mayomedia-72317.appspot.com",
  messagingSenderId: "150149852780",
  appId: "1:150149852780:web:3ae4926c3644570c74f249"
});

const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, 'http://localhost:9099'); 

const db = getDatabase(firebaseApp);

const loginEmailPassword = async() => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log(userCredential.user);
}

const lgnButton = document.querySelector('#loginBTN');
lgnButton.addEventListener('click', loginEmailPassword);

function register(){
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;
  repPassword = document.getElementById('rep-password').value;

  if(validate_email(email) == false || validate_password(password) == false || validate_password(password, repPassword) == false ){
    alert('Invalid email or password');
    return;
  }
  if(validate_field(email) == false || validate_field(password) == false || validate_field(repPassword) == false ){
    alert('All fields are required');
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
  .then(function(){
    var user = auth.currentUser;

    //add user to database
    var database_ref = db.ref();

    //create user data
    user_data = {
      email: email,
      last_login: Date.now(),
    }

    database_ref.child('users').child(user.uid).set(user_data);

}).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
});
}

function validate_email(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function validate_password(password) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return re.test(password);
}

function validate_repPassword(password, repPassword) {
  return password === repPassword;
}
function validate_field(field){
  if (field == null || field.length == 0) {
    return false;
  } else {
    return true;
  }
}


function gt() {
  var txt = document.getElementById("email").value;
        alert(txt);
}