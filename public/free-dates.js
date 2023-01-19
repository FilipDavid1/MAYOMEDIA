import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc, updateDoc,  } from './firebase.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

const rezervationRef = collection(db, 'events');

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
                        title: 'Obsadené',
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