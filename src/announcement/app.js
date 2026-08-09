document.addEventListener('DOMContentLoaded', () => {
  const wordList = document.getElementById('word-list');

  const vocabPairs = [
    { georgian: 'გემრიელი', english: 'delicious' },
    { georgian: 'ლამაზი', english: 'beautiful' },
    { georgian: 'სულელი', english: 'stupid' }
  ];

  if (wordList) {
    vocabPairs.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${item.georgian}</strong> — ${item.english}`;
      wordList.appendChild(listItem);
    });
  }
});
