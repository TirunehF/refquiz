document.addEventListener('DOMContentLoaded', () => {
  let questions = [];
  let currentQuestionIndex = 0;
  let userAttempts = []; // Array to store user attempts for each question
  let stats = { shown: 0, correct: 0, wrong: 0 }; // Object to keep track of statistics

  function loadQuestions() {
    fetch('questions.json') // Adjust this URL to where your file is hosted
      .then(response => response.json())
      .then(loadedQuestions => {
        questions = shuffleQuestions(loadedQuestions);
        userAttempts = new Array(questions.length).fill({ attempts: 0, selected: [] });
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
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = `${question.index}. ${question.frage}`;
    const buttons = document.querySelectorAll('.answer-button');

    buttons.forEach((button, index) => {
      button.textContent = question.antworten[index];
      button.dataset.correct = question.loesung === String.fromCharCode(97 + index);
      button.style.display = 'block';

      button.classList.remove('selected', 'correct', 'incorrect');
      if (userAttempts[currentQuestionIndex].selected.includes(index)) {
        button.classList.add('incorrect');
      }
    });

    document.getElementById('prev-question').style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('confirm-answer').style.display = userAttempts[currentQuestionIndex].attempts < 2 ? 'block' : 'none';

    // Update statistics for questions shown
    stats.shown++;
    document.getElementById('stat-questions-shown').textContent = stats.shown;
  }

  function resetAnswerButtons() {
    document.querySelectorAll('.answer-button').forEach(button => {
      button.classList.remove('selected');
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
    const userAttempt = userAttempts[currentQuestionIndex];
    document.querySelectorAll('.answer-button').forEach((button, index) => {
      if (button.classList.contains('selected')) {
        if (!userAttempt.selected.includes(index)) {
          userAttempt.selected.push(index);
        }
        userAttempt.attempts++;

        if (button.dataset.correct === 'true') {
          button.classList.add('correct');
          stats.correct++; // Increment correct answers
          document.getElementById('stat-correct-answers').textContent = stats.correct;
          document.getElementById('next-question').style.display = 'block';
          document.getElementById('confirm-answer').style.display = 'none';
        } else {
          button.classList.add('incorrect');
          if (userAttempt.attempts === 2) {
            stats.wrong++; // Increment wrong answers
            document.getElementById('stat-wrong-answers').textContent = stats.wrong;
            document.querySelectorAll('.answer-button').forEach((btn, idx) => {
              if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
              }
            });
            document.getElementById('next-question').style.display = 'block';
            document.getElementById('confirm-answer').style.display = 'none';
          }
        }
      }
    });
  });

  document.querySelectorAll('.answer-button').forEach(button => {
    button.addEventListener('click', function() {
      resetAnswerButtons();
      this.classList.add('selected');
    });
  });

  // Theme toggle button
  const themeToggleButton = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  document.body.classList.add('dark-mode');
  themeToggleIcon.textContent = '🌞'; // Sun icon for light mode

  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Change the icon based on the mode
    if (document.body.classList.contains('dark-mode')) {
      themeToggleIcon.textContent = '🌜'; // Moon icon for dark mode
    } else {
      themeToggleIcon.textContent = '🌞'; // Sun icon for light mode
    }
  });

  loadQuestions();
});
