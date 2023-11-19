document.addEventListener('DOMContentLoaded', () => {
  let questions = [];
  let currentQuestionIndex = -1;
  
  function loadQuestions() {
    fetch('questions.json') // Adjust this URL to where your file is hosted
      .then(response => response.json())
      .then(loadedQuestions => {
        questions = loadedQuestions;
        displayQuestion(); // Display the first question after loading them
      })
      .catch(error => console.error('Error loading questions:', error));
  }
  
  function displayQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.frage;
    const buttons = document.querySelectorAll('.answer-button');
    buttons.forEach((button, index) => {
      button.textContent = question.antworten[index];
      button.dataset.correct = question.loesung === String.fromCharCode(97 + index); // 'a' is 97 in ASCII
      button.style.display = 'block'; // Show all answer buttons
    });
    
    // Show the confirm button and hide the next question button
    document.getElementById('confirm-answer').style.display = 'block';
    document.getElementById('next-question').style.display = 'none';
  }
  
  function resetAnswerButtons() {
    document.querySelectorAll('.answer-button').forEach(button => {
      button.classList.remove('selected', 'correct', 'incorrect');
    });
  }

  document.getElementById('next-question').addEventListener('click', () => {
    resetAnswerButtons();
    displayQuestion();
  });

  document.getElementById('confirm-answer').addEventListener('click', () => {
    document.querySelectorAll('.answer-button').forEach(button => {
      if (button.classList.contains('selected')) {
        // An answer was selected
        if(button.dataset.correct === 'true') {
          button.classList.add('correct');
        } else {
          button.classList.add('incorrect');
        }
        // Show the next question button and hide the confirm answer button
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

  loadQuestions();
});
