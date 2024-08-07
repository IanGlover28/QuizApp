const quizData = [
    {
        question: "What is the capital of France?",
        a: "Berlin",
        b: "Madrid",
        c: "Paris",
        d: "Lisbon",
        correct: "c",
    },
    {
        question: "Who is the CEO of Tesla?",
        a: "Bill Gates",
        b: "Elon Musk",
        c: "Jeff Bezos",
        d: "Tony Stark",
        correct: "b",
    },
    {
        question: "What is the most used programming language in 2021?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "JavaScript",
        correct: "d",
    },
    {
        question: "Who won the FIFA World Cup in 2018?",
        a: "Germany",
        b: "Argentina",
        c: "Brazil",
        d: "France",
        correct: "d",
    },
];

const quiz = document.getElementById('quiz');
const startForm = document.getElementById('name-form');
const usernameInput = document.getElementById('username');
const quizSection = document.getElementById('quiz-section');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');

let currentQuiz = 0;
let score = 0;
let userName = '';

startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userName = usernameInput.value.trim();
    if (userName) {
        document.getElementById('start-form').style.display = 'none';
        quizSection.style.display = 'block';
        loadQuiz();
    } else {
        alert('Please enter your name.');
    }
});

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}

function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    if (answer) {
        if (answer === quizData[currentQuiz].correct) {
            score++;
        }
        currentQuiz++;
        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            if (userName) {
                fetch('http://localhost:3000/submit-score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: userName, score: score })
                }).then(response => response.text())
                  .then(data => {
                      let message = '';
                      if (score >= quizData.length * 0.8) {
                          message = 'YOU ARE THE GOAT';
                      } else {
                          message = 'eiii one Don';
                      }
                      quiz.innerHTML = `
                          <h2>${userName}, you answered ${score}/${quizData.length} questions correctly</h2>
                          <p>${message}</p>
                          <p>${data}</p>
                          <button onclick="location.reload()">Reload</button>
                      `;
                  })
                  .catch(error => {
                      console.error('Error:', error);
                      quiz.innerHTML = `
                          <h2>You answered ${score}/${quizData.length} questions correctly</h2>
                          <p>Sorry, there was an error submitting your score.</p>
                          <button onclick="location.reload()">Reload</button>
                      `;
                  });
            } else {
                quiz.innerHTML = `
                    <h2>You answered ${score}/${quizData.length} questions correctly</h2>
                    <button onclick="location.reload()">Reload</button>
                `;
            }
        }
    }
});
