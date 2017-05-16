const APP_ID = "591ab4b210360c000123da863c898f5020fd444d5fd6175590492756";

const sendTextToServer = (text) => {
  let url = "https://neytopia.cloud.tyk.io/chatbot/";
  const content = {
    text: text,
    id: WHENHUB_USER_ID
  };
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': APP_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log(error)
  });
}
