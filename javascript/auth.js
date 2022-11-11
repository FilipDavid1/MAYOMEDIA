import { auth, database, set, ref, update, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase.js";

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
  document.getElementsByClassName("loader")[0].style.display = "block";
  
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
          last_login: Date.now(),
        }).then(() => {
          // Data saved successfully!
          
          document.getElementsByClassName("loader")[0].style.display = "none";
          window.location.replace("./signIn.html");
        })
          .catch((error) => {
            // The write failed...
            document.getElementsByClassName("loader")[0].style.display = "none";
            console.log(error);
          });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementsByClassName("loader")[0].style.display = "none";
      // ..
    });

}
else if (!emailValidation(email)) {
  document.getElementById('emailLabel').style.visibility = "visible";
  document.getElementsByClassName("loader")[0].style.display = "none";
}
else if (!passwordValidation(password)) {
  document.getElementById('passwordLabel').style.visibility = "visible";
  document.getElementsByClassName("loader")[0].style.display = "none";
}
else if (!passwordMatch(password, repPassword)) {
  document.getElementById('repPasswordLabel').style.visibility = "visible";
  document.getElementsByClassName("loader")[0].style.display = "none";
}
else {
  alert("Something went wrong");
  document.getElementsByClassName("loader")[0].style.display = "none";
}
})


loginBtn.addEventListener("click", (e) => {
  document.getElementsByClassName("loader")[0].style.display = "block";
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
        document.getElementsByClassName("loader")[0].style.display = "none";
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

