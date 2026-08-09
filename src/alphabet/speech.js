function speakText(text, onStatus = () => {}) {
  if (!('speechSynthesis' in window)) {
    onStatus('Speech is not supported on this device.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ka-GE';
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find((voice) => /ka|ge/i.test(voice.lang)) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

window.georgianPartnerSpeech = {
  speakText
};
