const questions = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        option1: "script",
        option2: "javascript",
        option3: "js",
        correctOption: "script",
    },

    {
        question: "Where is the correct place to insert a JavaScript?",
        option1: "The head section",
        option2: "The body section",
        option3: "Both the head and body section are correct",
        correctOption: "Both the head and body section are correct",
    },

    {
        question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
        option1: "script href=xxx.js",
        option2: "script name=xxx.js",
        option3: "script src=xxx.js",
        correctOption: "script src=xxx.js",
    },
];

let quizBox = document.querySelector("#quizbox");
let nextBtn = document.querySelector("#nextbutton");
let questionCount = document.querySelector("#question-count");
let progressBar = document.querySelector("#progress-bar");
let progressPercent = document.querySelector("#progress-percent");
let feedback = document.querySelector("#quiz-feedback");

let questionNo = 0;
let score = 0;
let selectedOption = null;
let answerChecked = false;

const showQuestion = () => {
    selectedOption = null;
    answerChecked = false;

    feedback.textContent = "";
    feedback.className = "";

    const currentQuestion = questions[questionNo];
    const progress = ((questionNo + 1) / questions.length) * 100;

    questionCount.textContent =
        `Question ${questionNo + 1} of ${questions.length}`;

    progressBar.style.width = `${progress}%`;
    progressPercent.textContent = `${Math.round(progress)}%`;

    quizBox.innerHTML = `
        <h2 class="quiz-question">
            ${questionNo + 1}. ${currentQuestion.question}
        </h2>

        <div class="quiz-options">
            ${[1, 2, 3].map(number => {
                const option = currentQuestion[`option${number}`];

                return `
                    <label class="quiz-option">
                        <input
                            type="radio"
                            name="options"
                            value="${number}"
                        >
                        <span>${option}</span>
                    </label>
                `;
            }).join("")}
        </div>
    `;

    const options = document.querySelectorAll(
        'input[name="options"]'
    );

    options.forEach((option) => {
        option.addEventListener("change", () => {
            if (answerChecked) return;

            selectedOption = Number(option.value);

            document.querySelectorAll(".quiz-option").forEach(label => {
                label.classList.remove("selected");
            });

            option.closest(".quiz-option").classList.add("selected");

            nextBtn.disabled = false;
        });
    });

    nextBtn.disabled = true;
    nextBtn.innerHTML = 'Check Answer <span>→</span>';
};

const checkAnswer = () => {
    const currentQuestion = questions[questionNo];

    const correctNumber = [1, 2, 3].find(number =>
        currentQuestion[`option${number}`] ===
        currentQuestion.correctOption
    );

    const options = document.querySelectorAll(
        'input[name="options"]'
    );

    options.forEach(option => {
        option.disabled = true;

        const label = option.closest(".quiz-option");
        const optionNumber = Number(option.value);

        if (optionNumber === correctNumber) {
            label.classList.add("correct");
        }

        if (
            optionNumber === selectedOption &&
            selectedOption !== correctNumber
        ) {
            label.classList.add("wrong");
        }
    });

    if (selectedOption === correctNumber) {
        score++;
        feedback.textContent = "✓ Correct answer! Well done!";
        feedback.className = "feedback-correct";
    } else {
        feedback.textContent =
            `Not quite! The correct answer is: ${currentQuestion.correctOption}`;
        feedback.className = "feedback-wrong";
    }

    answerChecked = true;

    nextBtn.innerHTML =
        questionNo === questions.length - 1
            ? 'See Results <span>→</span>'
            : 'Next Question <span>→</span>';
};

const showResult = () => {
    const percentage = Math.round(
        (score / questions.length) * 100
    );

    let message = "Good effort! Keep practising.";
    let emoji = "💪";

    if (percentage === 100) {
        message = "Perfect score! Amazing work!";
        emoji = "🏆";
    } else if (percentage >= 60) {
        message = "Great job! You're learning well.";
        emoji = "🎉";
    }

    questionCount.textContent = "Quiz completed!";
    progressBar.style.width = "100%";
    progressPercent.textContent = "100%";

    quizBox.innerHTML = `
        <div class="quiz-result">
            <div class="result-icon">${emoji}</div>
            <h2>Quiz Completed!</h2>
            <p>${message}</p>
            <div class="result-score">${score}/${questions.length}</div>
            <p>You scored ${percentage}%</p>
        </div>
    `;

    feedback.textContent = "";
    nextBtn.disabled = false;
    nextBtn.innerHTML = 'Try Again <span>↻</span>';
};

const restartQuiz = () => {
    questionNo = 0;
    score = 0;
    showQuestion();
};

nextBtn.addEventListener("click", () => {
    if (questionNo >= questions.length) {
        restartQuiz();
        return;
    }

    if (!answerChecked) {
        checkAnswer();
        return;
    }

    questionNo++;

    if (questionNo < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

showQuestion();