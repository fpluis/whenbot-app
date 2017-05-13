const ENTER_KEY_CODE = "13";

let userInput, micButton, voiceButton;

window.onload = () => {
  userInput = document.getElementById("text-input");
  micButton = document.getElementById("voice-input");
  voiceButton = document.getElementById("voice-output");

  userInput.onkeypress = (keyPressedEvent) => {
    const event = keyPressedEvent || window.event;
    const charCode = event.which || event.keyCode;

    if (charCode == ENTER_KEY_CODE) {
      const text = userInput.value;
      processUserMessage(text);
    }
  }

  micButton.onclick = () => {
    recognizeSpeech(processUserMessage);
  }

  voiceButton.onclick = () => {
    textToSpeechEnabled = !textToSpeechEnabled;
    voiceButton.src = textToSpeechEnabled
      ? "images/volume_up.svg"
      : "images/volume_mute.svg";
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
  const message = document.createElement("li");
  message.classList.add(person);

  const p = document.createElement("p");
  p.textContent = text;
  message.appendChild(p);

  const timeStamp = document.createElement("time");
  const time = new Date();
  timeStamp.textContent = time.toLocaleTimeString();
  message.appendChild(timeStamp);

  const messages = document.querySelector("ol");
  messages.appendChild(message);
  message.scrollIntoView();
};

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