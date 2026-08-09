const vocabPairs = window.wordsData || [];

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ka-GE';
  utterance.rate = 0.8;
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find((voice) => /ka|ge/i.test(voice.lang)) || voices[0];
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function createSpeakerButton(label, text) {
  const button = document.createElement('button');
  button.className = 'speaker-button';
  button.type = 'button';
  button.title = `Say ${label}`;
  button.innerHTML = '🔊';
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    speakText(text);
  });
  return button;
}

const wordList = document.getElementById('word-list');

if (wordList) {
  vocabPairs.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className = 'word-card';
    listItem.innerHTML = `
      <div class="word-card__text">
        <strong>${item.georgian}</strong>
        <span>${item.english}</span>
      </div>
    `;
    listItem.appendChild(createSpeakerButton(item.georgian, item.georgian));
    wordList.appendChild(listItem);
  });
}
