const socket = io();

console.log("hello");

//Use watchPosition to track the users location continuously.
//Emit the latitude and longitude via a socket with "send-location". Log any errors to the console
if(navigator.geolocation)
{
    navigator.geolocation.watchPosition((position)=>{

        const{latitude,longitude} = position.coords;
        socket.emt("send-location",{latitude,longitude});
    
    },
    (error) =>{
        console.log(error);
    },
    {
        //Set options for high accuracy, a 5-second timeout, and no caching.
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,
    }
);
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "tina"
}).addTo(map);

const markers = {};
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});