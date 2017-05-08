

/*
let map, pyrmont, googleMapsService;
window.onload = () => {
  pyrmont = new google.maps.LatLng(0, 0);
  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });
  googleMapsService = new google.maps.places.PlacesService(map);
}
*/

const getPlacesFromAddress = (query) => {
  const url = "https://us-central1-chatbot-165909.cloudfunctions.net/getLocation";
  return fetch(url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: query
    })
  .then((result) => {
    return result.json();
  }).catch((error) => {
    console.log("Unable to connect to Places API " + error)
  })
}

/*
const getPlacesFromAddress = (query) => {
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + AUTOCOMPLETE_PLACES_API_KEY, 
    type: "GET",   
    dataType: 'JSONP',
    jsonpCallback: 'callback',
    success: (response) => {                          
      console.log(response);                   
    },
    error: (error) => {
      console.log(error)
    }
  });
}
*/

/*
const getPlacesFromAddress = (query) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + AUTOCOMPLETE_PLACES_API_KEY);
  xhr.onreadystatechange = (response) => {
    console.log(response)
  }
  xhr.send();
  xhr.onload = function() {
    var responseText = xhr.responseText;
    console.log(responseText);
    // process the response.
  };
  xhr.onerror = (error) => {
    console.log(error)
  }
}

/*
const getPlacesFromAddress = (query) => {
  const request = {
    query: query
  }
  googleMapsService.textSearch(request, callback);
}*/