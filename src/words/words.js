const vocabPairs = window.wordsData || [];
let ttsBusy = false;

function speakGeorgian(text) {
  if (!text || !('speechSynthesis' in window)) return;
  if (ttsBusy) return;
  ttsBusy = true;

  const trySpeak = () => {
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ka-GE';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = synth.getVoices() || [];
    const preferred =
      voices.find((voice) => /^ka/i.test(voice.lang)) ||
      voices.find((voice) => /ka|ge/i.test(voice.lang)) ||
      voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      ttsBusy = false;
    };
    utterance.onerror = () => {
      ttsBusy = false;
    };

    synth.speak(utterance);
  };

  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  if (voices && voices.length) {
    trySpeak();
    return;
  }

  const onVoicesChanged = () => {
    synth.removeEventListener('voiceschanged', onVoicesChanged);
    window.setTimeout(trySpeak, 50);
  };

  synth.addEventListener('voiceschanged', onVoicesChanged);

  window.setTimeout(() => {
    synth.removeEventListener('voiceschanged', onVoicesChanged);
    trySpeak();
  }, 1500);
}

function createSpeakerButton(label, text) {
  const button = document.createElement('button');
  button.className = 'speaker-button';
  button.type = 'button';
  button.title = `Say ${label}`;
  button.innerHTML = '🔊';
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    speakGeorgian(text);
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
