document.addEventListener('DOMContentLoaded', () => {
  let questions = [];
  let currentQuestionIndex = -1;
  let userAnswers = []; // Array to store user answers

  function loadQuestions() {
    fetch('questions.json') // Adjust this URL to where your file is hosted
      .then(response => response.json())
      .then(loadedQuestions => {
        questions = shuffleQuestions(loadedQuestions);
        userAnswers = new Array(questions.length).fill(null); // Initialize user answers array
        displayQuestion(); // Display the first question after loading them
      })
      .catch(error => console.error('Error loading questions:', error));
  }

  function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function displayQuestion() {
    currentQuestionIndex = Math.max(0, Math.min(currentQuestionIndex, questions.length - 1));
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.frage;
    const buttons = document.querySelectorAll('.answer-button');

    buttons.forEach((button, index) => {
      button.textContent = question.antworten[index];
      button.dataset.correct = question.loesung === String.fromCharCode(97 + index);
      button.style.display = 'block';

      button.classList.remove('selected', 'correct', 'incorrect');
      if (userAnswers[currentQuestionIndex] === index) {
        button.classList.add('selected');
      }
    });

    // Update the visibility of the navigation buttons
    document.getElementById('prev-question').style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    document.getElementById('next-question').style.display = 'none'; // Hide until confirmed
    document.getElementById('confirm-answer').style.display = userAnswers[currentQuestionIndex] === null ? 'block' : 'none';
  }

  function resetAnswerButtons() {
    document.querySelectorAll('.answer-button').forEach(button => {
      button.classList.remove('selected', 'correct', 'incorrect');
    });
  }

  document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    resetAnswerButtons();
    displayQuestion();
  });

  document.getElementById('prev-question').addEventListener('click', () => {
    currentQuestionIndex--;
    resetAnswerButtons();
    displayQuestion();
  });

  document.getElementById('confirm-answer').addEventListener('click', () => {
    document.querySelectorAll('.answer-button').forEach((button, index) => {
      if (button.classList.contains('selected')) {
        userAnswers[currentQuestionIndex] = index;
        if (button.dataset.correct === 'true') {
          button.classList.add('correct');
        } else {
          button.classList.add('incorrect');
        }
        document.getElementById('next-question').style.display = 'block';
        document.getElementById('confirm-answer').style.display = 'none';
      }
    });
  });

  document.querySelectorAll('.answer-button').forEach(button => {
    button.addEventListener('click', function() {
      resetAnswerButtons();
      this.classList.add('selected');
    });
  });

  document.body.classList.add('dark-mode');

  // Theme toggle button
  const themeToggleButton = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  themeToggleIcon.textContent = '🌞'; // Sun icon for light mode

  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Change the icon based on the mode
    if (document.body.classList.contains('dark-mode')) {
      themeToggleIcon.textContent = '🌞'; // Moon icon for dark mode
    } else {
      themeToggleIcon.textContent = '🌜'; // Sun icon for light mode
    }
  });

  loadQuestions();
});
