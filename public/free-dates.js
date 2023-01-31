import { db, collection, onSnapshot,  } from './firebase.js';

const rezervationRef = collection(db, 'events');

var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    events: function(info, successCallback, failureCallback) {
        var events = [];
        onSnapshot(rezervationRef, (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                //disable date if confirmed
                if(doc.data().confirmed == true){
                    var data = doc.data();
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