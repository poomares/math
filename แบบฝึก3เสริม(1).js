const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = quizContainer.querySelector(".answer-options");
const nextQuestionBtn = quizContainer.querySelector(".next-question-btn");
const questionStatus = quizContainer.querySelector(".question-status");
const timerDisplay = quizContainer.querySelector(".timer-duration");
const resultContainer = document.querySelector(".result-container");

// Quiz state variables
const QUIZ_TIME_LIMIT = 60;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";  // fix ค่าตายตัว
let numberOfQuestions = 10;         // fix ค่าตายตัว
let currentQuestion = null;
const questionsIndexHistory = [];
let correctAnswersCount = 0;
let disableSelection = false;

const updateUserScore = () => {
  let currentScore = parseInt(localStorage.getItem("score")) || 0;
  currentScore += correctAnswersCount;
  localStorage.setItem("score", currentScore);

  const scoreDisplay = document.getElementById("userScore");
  if (scoreDisplay) {
    scoreDisplay.textContent = currentScore;
  }
};

// Display the quiz result and hide the quiz container
const showQuizResult = () => {
  clearInterval(timer);
  document.querySelector(".quiz-popup").classList.remove("active");
  document.querySelector(".result-popup").classList.add("active");
  const resultText = `คุณตอบถูก <b>${correctAnswersCount}</b> ข้อ จากทั้งหมด <b>${numberOfQuestions}</b> ข้อ เยี่ยมไปเลย!`;
  resultContainer.querySelector(".result-message").innerHTML = resultText;
  updateUserScore();
  
  // --- บรรทัดที่เพิ่มเข้ามา ---
  finishExercise('m3_ex1'); // บันทึกว่าแบบฝึกหัดนี้ (ID: m1_ex1) ทำเสร็จแล้ว
};

// Clear and reset the timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

// Initialize and start the timer for the current question
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 0) {
      clearInterval(timer);
      disableSelection = true;
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";
      highlightCorrectAnswer();
      // Disable all answer options
      answerOptions.querySelectorAll(".answer-option").forEach((option) => (option.style.pointerEvents = "none"));
    }
  }, 1000);
};

// Fetch a random question from the fixed category
const getRandomQuestion = () => {
  const categoryQuestions = questions.find((cat) => cat.category.toLowerCase() === quizCategory.toLowerCase())?.questions || [];
  // Show the results if all questions have been used
  if (questionsIndexHistory.length >= Math.min(numberOfQuestions, categoryQuestions.length)) {
    return showQuizResult();
  }
  // Filter out already asked questions and choose a random one
  const availableQuestions = categoryQuestions.filter((_, index) => !questionsIndexHistory.includes(index));
  const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};

// Highlight the correct answer option and add icon
const highlightCorrectAnswer = () => {
  const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded"> check_circle </span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

// Handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
  if (disableSelection) return;
  clearInterval(timer);
  disableSelection = true;
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectAnswer() : correctAnswersCount++;
  // Insert icon based on correctness
  const iconHTML = `<span class="material-symbols-rounded"> ${isCorrect ? "check_circle" : "cancel"} </span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);
  // Disable all answer options
  answerOptions.querySelectorAll(".answer-option").forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
};

// Render the current question and its options
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;
  disableSelection = false;
  resetTimer();
  startTimer();

  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#32313C";
  quizContainer.querySelector(".question-text").textContent = currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
  answerOptions.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.append(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

// Start the quiz
const startQuiz = () => {
  document.querySelector(".config-popup").classList.remove("active");
  document.querySelector(".quiz-popup").classList.add("active");
  renderQuestion();
};

// Reset the quiz
const resetQuiz = () => {
  resetTimer();
  correctAnswersCount = 0;
  questionsIndexHistory.length = 0;
  document.querySelector(".config-popup").classList.add("active");
  document.querySelector(".result-popup").classList.remove("active");
};

// Event listeners
nextQuestionBtn.addEventListener("click", renderQuestion);
resultContainer.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
configContainer.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);

// ฟังก์ชันสำหรับบันทึกความคืบหน้าเมื่อทำแบบฝึกหัดเสร็จ
function finishExercise(exerciseId) {
  // ดึงข้อมูลความคืบหน้าเดิม (ถ้ามี) จาก localStorage
  let progressData = JSON.parse(localStorage.getItem('userProgress')) || {};

  // สร้าง Array สำหรับเก็บ ID แบบฝึกหัดที่ทำเสร็จแล้ว (ถ้ายังไม่มี)
  if (!progressData.completed) {
    progressData.completed = [];
  }

  // ตรวจสอบว่ายังไม่เคยบันทึก ID นี้ เพื่อป้องกันการนับซ้ำ
  if (!progressData.completed.includes(exerciseId)) {
    progressData.completed.push(exerciseId);
  }

  // บันทึกข้อมูลที่อัปเดตแล้วกลับลง localStorage
  localStorage.setItem('userProgress', JSON.stringify(progressData));
  
  console.log("บันทึกความคืบหน้าสำหรับ ID:", exerciseId); // สามารถลบบรรทัดนี้ออกได้เมื่อทดสอบเสร็จ
}