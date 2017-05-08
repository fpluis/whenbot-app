const local = true;

const sendTextToServer = (text) => {
  if (local) {
    let url = "/chatbot?text=" + text + "&id=" + WHENHUB_ACCESS_TOKEN;
    return fetch(url).then((response) => {
      return response.json();
    });
  } else {
    let url = "https://us-central1-chatbot-165909.cloudfunctions.net/helloWorld";
    const content = {
      text: text,
      id: WHENHUB_ACCESS_TOKEN
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
}
