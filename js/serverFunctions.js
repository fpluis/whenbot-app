const APP_ID = "591ab4b210360c000123da86ed4fc3a056d14b6d7f4677b3d6a977f6";
const API_URL = "https://neytopia.cloud.tyk.io/chatbot/";

const sendTextToServer = (text) => {
  const content = {
    text: text,
    id: WHENHUB_USER_ID
  };
  return fetch(API_URL, {
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