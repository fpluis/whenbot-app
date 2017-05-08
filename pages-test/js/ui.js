const ENTER_KEY_CODE = "13";

let userInput, microphoneButton;

window.onload = () => {
  userInput = document.getElementById("text-input");
  microphoneButton = document.getElementById("voice-input");

  userInput.onkeypress = (keyPressedEvent) => {
    const event = keyPressedEvent || window.event;
    const charCode = event.which || event.keyCode;

    if (charCode == ENTER_KEY_CODE) {
      const text = userInput.value;
      processUserMessage(text);
    }
  }

  microphoneButton.onclick = () => {
    recognizeSpeech(processUserMessage);
  }

  sendTextToServer("I want to start fresh")
  .then((result) => {
    processChatbotResult(result);
  });
}

const processUserMessage = (text) => {
  addMessage(text, "self");
  cleanTextInput();
  sendTextToServer(text)
  .then((result) => {
    processChatbotResult(result);
  });
}

const say = (message) => {
  addMessage(message, "other");
  speakMessage(message);
}

const addMessage = (text, person) => {
  const chat = document.getElementById("chat");
  const newMessage = document.createElement("li");
  newMessage.setAttribute("class", person);
  const avatar = createAvatar(person);
  newMessage.appendChild(avatar);
  const message = document.createElement("div");
  message.setAttribute("class", "msg");
  const messageContent = document.createElement("p");
  messageContent.textContent = text;
  message.appendChild(messageContent);
  const timeStamp = document.createElement("time");
  const time = new Date();
  timeStamp.textContent = time.getHours() + ":" + time.getMinutes();
  message.appendChild(timeStamp);
  newMessage.appendChild(message);

  chat.appendChild(newMessage);
}

const createAvatar = (person) => {
  const avatar = document.createElement("div");
  avatar.setAttribute("class", "avatar");
  const image = document.createElement("img");
  image.setAttribute("draggable", false);
  let imageSource;
  switch(person) {
    case "other":
      imageSource = "http://i.imgur.com/if6DCir.png";
      break;
    case "self":
      imageSource = "http://i.imgur.com/pGA4g4A.png";
      break;
  }
  image.setAttribute("src", imageSource);
  avatar.appendChild(image);
  return avatar;
}

const cleanTextInput = () => {
  userInput.value = "";
}

const saySchedulesToUser = (schedules) => {
  const scheduleMessage = schedulesToMessage(schedules);
  say(scheduleMessage);
  if (schedules != null
   && schedules.length > 1) {
    const inviteToKnowMoreMessage = "If you want to know more, say 'show me schedule ...' and the number or name of the schedule";
    say(inviteToKnowMoreMessage);
  }
}

const sayEventsToUser = (events) => {
  const eventMessage = eventsToMessage(events);
  say(eventMessage);
  if (events != null
   && events.length > 1) {
    const inviteToKnowMoreMessage = "If you want to know more, say 'show me event ...' and the number or name of the event";
    say(inviteToKnowMoreMessage);
  }
}