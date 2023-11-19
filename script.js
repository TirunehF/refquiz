  document.addEventListener('DOMContentLoaded', () => {
    // const questions = [
    //   {
    //     "frage": "Wie ist das Idealmass eines (neuen) Spielfeldes?",
    //     "antworten": ["120 m x 90 m", "100 m x 64 m", "90 m x 45 m"],
    //     "loesung": "b"
    //   },
    //   {
    //     "frage": "Der Netzraum gehört...",
    //     "antworten": ["nicht zum Spielfeld.", "auch zum Spielfeld.", "zum Torraum und somit zum Spielfeld."],
    //     "loesung": "a"
    //   },
    //   {
    //     "frage": "Der Abstand der Torraumlinie zum Torpfosten beträgt...",
    //     "antworten": ["5,5 m", "5 m", "9,15 m"],
    //     "loesung": "a"
    //   }
    //   // Add more questions here in the same format
    // ];
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
      question.antworten.forEach((answer, index) => {
        buttons[index].textContent = answer;
        buttons[index].dataset.correct = question.loesung === String.fromCharCode(97 + index); // 'a' is 97 in ASCII
      });
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
          if(button.dataset.correct === 'true') {
            button.classList.add('correct');
          } else {
            button.classList.add('incorrect');
          }
        }
        if(button.dataset.correct === 'true') {
          button.classList.add('correct');
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
    // displayQuestion(); // Display the first question on initial load
  });
