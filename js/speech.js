var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

const recognizeSpeech = (callbackOnResult) => {
  const recognition = new SpeechRecognition();
  recognition.grammars = new SpeechGrammarList();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    callbackOnResult(speechResult)
  }

  recognition.onspeechend = () => {
    recognition.stop();
    console.log("Speech recognition ended")
  }

  recognition.onerror = (event) => {
    console.log("Error recognizing speech")
  }
}

const speakMessage = (message) => {
  if (textToSpeechEnabled) {
    const speechMessage = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speechMessage);
  }
}