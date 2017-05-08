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