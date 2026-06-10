let testQuestions = [];
let current = 0;
let score = 0;
let canClick = true;

/* ---------- SOUNDS ---------- */
const clickSound = new Audio("click.mp3");
const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");

function playSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play();
}

/* ---------- SCREEN CONTROL ---------- */
function showScreen(screen) {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('ticketContainer').style.display = 'none';
  document.getElementById('testContainer').style.display = 'none';
  document.getElementById('resultBox').style.display = 'none';

  document.getElementById(screen).style.display = 'block';
}

/* ---------- START TEST ---------- */
function startTest() {
  playSound(clickSound);

  showScreen('testContainer');

  const pool = [
    ...data.km01.questions,
    ...data.km02.questions,
    ...data.km03.questions
  ];

  testQuestions = shuffle(pool).slice(0, 10).map(q => {
    const wrongPool = pool.filter(x => x.correctAnswer !== q.correctAnswer);
    const wrong = shuffle(wrongPool).slice(0, 3).map(x => x.correctAnswer);

    return {
      ...q,
      options: shuffle([q.correctAnswer, ...wrong])
    };
  });

  current = 0;
  score = 0;

  renderIndicators();
  showQuestion();
}

/* ---------- SHOW QUESTION ---------- */
function showQuestion() {
  canClick = true;

  if (current >= testQuestions.length) {
    showResult();
    return;
  }

  const q = testQuestions[current];

  document.getElementById('question').innerText = q.text;

  const optBox = document.getElementById('options');
  optBox.innerHTML = '';

  q.options.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'option';
    div.innerText = opt;

    div.onclick = () => selectAnswer(div, opt, q.correctAnswer);
    optBox.appendChild(div);
  });

  updateIndicators();
}

/* ---------- ANSWER ---------- */
function selectAnswer(el, chosen, correct) {
  if (!canClick) return;
  canClick = false;

  playSound(clickSound);

  document.querySelectorAll('.option').forEach(o => {
    if (o.innerText === correct) {
      o.classList.add('correct');
    }
  });

  if (chosen === correct) {
    el.classList.add('correct');
    score++;
    markIndicator('green');
    playSound(correctSound);
  } else {
    el.classList.add('wrong');
    markIndicator('red');
    playSound(wrongSound);
  }

  runTimer();

  setTimeout(() => {
    nextQuestion();
  }, 2500);
}

/* ---------- TIMER ---------- */
function runTimer() {
  const timer = document.getElementById('timer');
  const bar = document.getElementById('timerBar');

  if (!timer || !bar) return;

  timer.classList.add('show');
  timer.classList.remove('hide');

  bar.style.transition = 'none';
  bar.style.width = '0%';

  void bar.offsetWidth;

  requestAnimationFrame(() => {
    bar.style.transition = 'width 3s linear';
    bar.style.width = '100%';
  });

  setTimeout(() => {
    timer.classList.add('hide');
    timer.classList.remove('show');

    setTimeout(() => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
    }, 300);

  }, 3000);
}

/* ---------- NEXT ---------- */
function nextQuestion() {
  const qBox = document.getElementById('question');
  const optBox = document.getElementById('options');

  qBox.classList.add('fade-out');
  optBox.classList.add('fade-out');

  setTimeout(() => {
    current++;

    if (current >= testQuestions.length) {
      showResult();
      return;
    }

    showQuestion();

    requestAnimationFrame(() => {
      qBox.classList.remove('fade-out');
      optBox.classList.remove('fade-out');

      qBox.classList.add('fade-in');
      optBox.classList.add('fade-in');

      setTimeout(() => {
        qBox.classList.remove('fade-in');
        optBox.classList.remove('fade-in');
      }, 300);
    });

  }, 200);
}

/* ---------- INDICATORS ---------- */
function renderIndicators() {
  const box = document.getElementById('indicators');
  box.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'box';
    d.innerText = i + 1;
    box.appendChild(d);
  }
}

function updateIndicators() {
  document.querySelectorAll('.box').forEach((b, i) => {
    b.classList.remove('active');
    if (i === current) b.classList.add('active');
  });
}

function markIndicator(type) {
  const box = document.querySelectorAll('.box')[current];
  if (box) box.classList.add(type);
}

/* ---------- RESULT ---------- */
function showResult() {
  showScreen('resultBox');

  const percent = Math.round((score / testQuestions.length) * 100);

  document.getElementById('resultBox').innerHTML = `
    <div class="result">
      <h2>Результаты</h2>
      <p>Правильно: ${score}</p>
      <p>Неправильно: ${testQuestions.length - score}</p>
      <p>Процент: ${percent}%</p>

      <button class="btn finish-btn" onclick="restartTest()">
        🔁 Пройти ещё раз
      </button>

      <button class="btn" onclick="backToMenu()">
        🏠 В меню
      </button>
    </div>
  `;
}

function restartTest() {
  score = 0;
  current = 0;
  canClick = true;

  startTest();
}

/* ---------- SHUFFLE ---------- */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ---------- TICKET MODE ---------- */
function startTicket() {
  playSound(clickSound);

  showScreen('ticketContainer');

  const q1 = shuffle(data.km01.questions)[0];
  const q2 = shuffle(data.km02.questions)[0];
  const q3 = shuffle(data.km02.questions)[1];
  const q4 = shuffle(data.km03.questions)[0];

  const practice = shuffle(data.practice.tasks)[0];

  document.getElementById('ticketContent').innerHTML = `
    <h2>📘 Билет</h2>

    <div class="question-box"><b>1 (KM01):</b><br>${q1.text}</div>
    <div class="question-box"><b>2 (KM02):</b><br>${q2.text}</div>
    <div class="question-box"><b>3 (KM02):</b><br>${q3.text}</div>
    <div class="question-box"><b>4 (Практика):</b><br>${practice.text}</div>
  `;
}

/* ---------- BACK ---------- */
function backToMenu() {
  playSound(clickSound);
  showScreen('menu');
}