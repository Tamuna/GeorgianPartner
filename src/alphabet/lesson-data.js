function resolveMediaPath(fileName) {
  return `../../media/alphabet/pictures/${fileName}`;
}

const vocabPairs = [
  { georgian: 'გემრიელი', english: 'delicious' },
  { georgian: 'ლამაზი', english: 'beautiful' },
  { georgian: 'სულელი', english: 'stupid' }
];

const lessonSteps = [
  {
    title: 'Step 1: Look at the letters',
    instructions: 'Look at the pictures and say the sounds slowly.',
    type: 'show'
  },
  {
    title: 'Step 2: Learn the meaning',
    instructions: 'This word means something simple. Read it slowly and say the meaning.',
    type: 'meaning'
  }
];

const lessons = [
  {
    id: 'ai',
    word: 'აი',
    translation: 'here is',
    letters: [
      { src: resolveMediaPath('a.png'), alt: 'Letter a', label: 'ა', english: 'a' },
      { src: resolveMediaPath('i.png'), alt: 'Letter i', label: 'ი', english: 'i' }
    ]
  },
  {
    id: 'ia',
    word: 'ია',
    translation: 'violet',
    letters: [
      { src: resolveMediaPath('i.png'), alt: 'Letter i', label: 'ი', english: 'i' },
      { src: resolveMediaPath('a.png'), alt: 'Letter a', label: 'ა', english: 'a' }
    ]
  },
  {
    id: 'ai-thi',
    word: 'აი თითი',
    translation: 'here is a finger',
    letters: [
      { src: resolveMediaPath('a.png'), alt: 'Letter a', label: 'ა', english: 'a' },
      { src: resolveMediaPath('i.png'), alt: 'Letter i', label: 'ი', english: 'i' },
      { src: resolveMediaPath('th.png'), alt: 'Letter th', label: 'თ', english: 'th' }
    ]
  }
];

const STORAGE_KEY = 'georgian-partner-progress-v1';

const defaultState = {
  lessonIndex: 0,
  stepIndex: 0,
  completedLessons: []
};

window.georgianPartnerData = {
  resolveMediaPath,
  vocabPairs,
  lessonSteps,
  lessons,
  STORAGE_KEY,
  defaultState
};
