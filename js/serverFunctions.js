const sendTextToServer = (text) => {
  let url = "https://us-central1-chatbot-165909.cloudfunctions.net/helloWorld";
  const content = {
    text: text,
    id: WHENHUB_USER_ID
  };
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log(error)
  });
}
