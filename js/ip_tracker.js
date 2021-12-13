// pull from different file
// const bypass_cors_url = 'https://cors-anywhere.herokuapp.com/';
//localhost wont allow API access, so we bypass...and when we're deploying, we remove the bypass
//use .env for this
const secret_api ='at_w1veYvNM0dBAi8fELWobREZ4KsfWZ';
const api_uri = 'https://geo.ipify.org/api/'

let current_verion = 'v2';

// elements to update 
let current_ip = document.getElementById('current_ip');
let current_town = document.getElementById('current_town');
let current_zone = document.getElementById('current_zone');
let current_isp = document.getElementById('current_isp');

// form elements 
const entered_ip = document.getElementById('ip_address');
const search_btn = document.getElementById('search_btn');

//leaflet
//display-map div //option objects are defaults
//tilelayer is used to generate the app
const map = L.map('display-map', {
    'center': [0,0],
    'zoom': 0,
    'layers': [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          })
    ],
     'zoomControl': false 
});
L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

//pass a lat n longt to update its location
//update marker is gotten from the API, and its an array of lat and long, the default is stated below, 13 is zoom size
let updateMarker = (update_marker = [-33.665, 18.993]) => {
    map.setView(update_marker, 13);

    //setting the location marker
    L.marker(update_marker).addTo(map);
}

let getIPDetails = (default_ip) => {   
    let ip_url;
    if(default_ip){
        ip_url = `${api_uri}${current_verion}/country,city?apiKey=${secret_api}&ipAddress=${default_ip}`;
    } else {
        ip_url = `${api_uri}${current_verion}/country,city?apiKey=${secret_api}`
    }

    console.log(ip_url);
    fetch(ip_url)
        .then( results => results.json())
        .then( data => {
            console.log(data);
            current_ip.innerHTML = data.ip;
            current_town.innerHTML = `${data.location.city} ${data.location.country} ${data.location.postalCode}`;
            current_zone.innerHTML = data.location.timezone;
            current_isp.innerHTML = data.isp;

            // update map marker 
            updateMarker([data.location.lat, data.location.lng]);
        })
        .catch(error => {
            alert("Unable to get IP details");
            console.log(error);
            getIPDetails('');
        })
}

document.addEventListener('load', getIPDetails(entered_ip.value));

search_btn.addEventListener('click', e => {
    e.preventDefault()
    if(entered_ip.value) {
        getIPDetails(entered_ip.value);
        return;
    }
    alert("Please enter a valid IP address");
})
