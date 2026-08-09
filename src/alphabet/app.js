const resolveMediaPath = (fileName) => `../../media/alphabet/pictures/${fileName}`;
const lessonSteps = [
  { title: 'Step 1: Look at the letters', instructions: 'Look at the pictures and say the sounds slowly.', type: 'show' },
  { title: 'Step 2: Learn the meaning', instructions: 'This word means something simple. Read it slowly and say the meaning.', type: 'meaning' }
];
const lessons = [
  { id: 'ai', word: 'აი', translation: 'here is', letters: [
    { src: resolveMediaPath('a.png'), alt: 'Letter a', label: 'ა', english: 'a' },
    { src: resolveMediaPath('i.png'), alt: 'Letter i', label: 'ი', english: 'i' }
  ] },
  { id: 'ia', word: 'ია', translation: 'violet', letters: [
    { src: resolveMediaPath('i.png'), alt: 'Letter i', label: 'ი', english: 'i' },
    { src: resolveMediaPath('a.png'), alt: 'Letter a', label: 'ა', english: 'a' }
  ] },
  { id: 'ai-thi', word: 'აი თითი', translation: 'here is a finger', letters: [
    { src: resolveMediaPath('a.png'), alt: 'Letter a', label: 'ა', english: 'a' },
    { src: resolveMediaPath('i.png'), alt: 'Letter i', label: 'ი', english: 'i' },
    { src: resolveMediaPath('th.png'), alt: 'Letter th', label: 'თ', english: 'th' }
  ] }
];
const STORAGE_KEY = 'georgian-partner-progress-v1';
const defaultState = { lessonIndex: 0, stepIndex: 0 };

function speakText(text, onStatus = () => {}) {
  if (!('speechSynthesis' in window)) {
    onStatus('Speech is not supported on this device.');
    return;
  }

  const speakNow = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ka-GE';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) => /ka|ge/i.test(voice.lang)) || voices[0] || null;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.setTimeout(speakNow, 250);
    return;
  }

  speakNow();
}

const lessonBadge = document.getElementById('lesson-badge');
const progressBadge = document.getElementById('progress-badge');
const lessonTitle = document.getElementById('lesson-title');
const lessonInstructions = document.getElementById('lesson-instructions');
const letterGrid = document.getElementById('letter-grid');
const meaningBox = document.getElementById('meaning-box');
const feedback = document.getElementById('feedback');
const nextStepButton = document.getElementById('next-step');
const skipStepButton = document.getElementById('skip-step');
const resetButton = document.getElementById('reset-progress');
const lessonCard = document.querySelector('.lesson-card');
const params = new URLSearchParams(window.location.search);
const viewMode = params.get('mode') || 'alphabet';

let state = loadState();

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!savedState) {
      return { ...defaultState };
    }

    return {
      ...defaultState,
      ...savedState
    };
  } catch (error) {
    console.warn('Could not read progress', error);
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentLesson() {
  return lessons[state.lessonIndex];
}

function getCurrentStep() {
  return lessonSteps[state.stepIndex];
}

function getTotalSteps() {
  return lessons.length * lessonSteps.length;
}

function getCompletedStepsCount() {
  return state.lessonIndex * lessonSteps.length + state.stepIndex + 1;
}

function setFeedback(message) {
  if (feedback) {
    feedback.textContent = message;
  }
}

function createSpeakerButton(label, text) {
  const button = document.createElement('button');
  button.className = 'speaker-button';
  button.type = 'button';
  button.title = `Say ${label}`;
  button.innerHTML = '🔊';
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    speakText(text, setFeedback);
  });
  return button;
}

function renderLayout() {
  if (lessonCard) {
    lessonCard.style.display = 'block';
  }
}

function renderLesson() {
  renderLayout();

  const lesson = getCurrentLesson();
  const currentStep = getCurrentStep();

  if (lessonBadge) {
    lessonBadge.textContent = `Lesson ${state.lessonIndex + 1} of ${lessons.length}`;
  }

  if (progressBadge) {
    progressBadge.textContent = `${Math.round((getCompletedStepsCount() / getTotalSteps()) * 100)}% complete`;
  }

  if (lessonTitle) {
    lessonTitle.textContent = currentStep.title;
  }

  if (lessonInstructions) {
    lessonInstructions.textContent = currentStep.instructions;
  }

  if (letterGrid) {
    letterGrid.innerHTML = '';
    if (currentStep.type === 'show') {
      lesson.letters.forEach((letter) => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.innerHTML = `<img src="${letter.src}" alt="${letter.alt}" /><span>${letter.label}</span><small>${letter.english}</small>`;
        card.appendChild(createSpeakerButton(letter.label, letter.label));
        letterGrid.appendChild(card);
      });
    }
  }

  if (meaningBox) {
    meaningBox.innerHTML = '';
    if (currentStep.type !== 'show') {
      const panel = document.createElement('div');
      panel.className = 'meaning-panel';
      panel.innerHTML = `<p><strong>${lesson.word}</strong> means <strong>${lesson.translation}</strong>.</p>`;
      panel.appendChild(createSpeakerButton(lesson.word, lesson.word));
      meaningBox.appendChild(panel);
    }
  }

  setFeedback('');

  if (nextStepButton) {
    nextStepButton.textContent = state.stepIndex === lessonSteps.length - 1 && state.lessonIndex === lessons.length - 1 ? 'Finish lesson' : 'Next step';
  }
}

function advanceStep() {
  if (state.stepIndex < lessonSteps.length - 1) {
    state.stepIndex += 1;
  } else if (state.lessonIndex < lessons.length - 1) {
    state.lessonIndex += 1;
    state.stepIndex = 0;
  } else {
    state.stepIndex = lessonSteps.length - 1;
  }

  saveState();
  renderLesson();
}

nextStepButton?.addEventListener('click', () => {
  advanceStep();
});

skipStepButton?.addEventListener('click', () => {
  advanceStep();
});

resetButton?.addEventListener('click', () => {
  state = { ...defaultState };
  saveState();
  renderLesson();
});

renderLesson();
