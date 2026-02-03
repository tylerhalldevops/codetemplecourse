const quizData = [
    {
        question: "Which array method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answer: 0
    },
    {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var name = 'John'", "variable name = 'John'", "v name = 'John'", "declare name = 'John'"],
        answer: 0
    },
    {
        question: "Which method is used to select an element by its ID in the DOM?",
        options: ["getElementById()", "getElementsByClassName()", "querySelector()", "getElementByTagName()"],
        answer: 0
    },
    {
        question: "What does the '===' operator do in JavaScript?",
        options: ["Checks for equality without type coercion", "Checks for equality with type coercion", "Assigns a value", "Compares two arrays"],
        answer: 0
    },
    {
        question: "Which array method creates a new array with elements that pass a test?",
        options: ["filter()", "map()", "forEach()", "reduce()"],
        answer: 0
    },
    {
        question: "What is the purpose of 'addEventListener' in JavaScript?",
        options: ["To add event handlers to elements", "To create new elements", "To remove elements", "To style elements"],
        answer: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;

function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    
    // Update question text
    document.getElementById('question-container').textContent = currentQuestion.question;
    
    // Clear previous options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Reset next button state
    const nextButton = document.getElementById('next-button');
    nextButton.disabled = true;
    answerSelected = false;
    
    // Create option buttons
    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionButton);
    });
}

function selectOption(selectedIndex) {
    if (answerSelected) return; // Prevent multiple selections
    
    answerSelected = true;
    const currentQuestion = quizData[currentQuestionIndex];
    const buttons = document.querySelectorAll('#options-container button');
    
    // Disable all buttons
    buttons.forEach(button => button.disabled = true);
    
    // Check if correct
    if (selectedIndex === currentQuestion.answer) {
        score++;
        // Add green color/feedback for correct answer
        buttons[selectedIndex].classList.add('correct');
    } else {
        // Add red color/feedback for incorrect answer
        buttons[selectedIndex].classList.add('incorrect');
        // Also highlight the correct answer in green
        buttons[currentQuestion.answer].classList.add('correct');
    }
    
    // Enable next button
    document.getElementById('next-button').disabled = false;
}

document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('score-container').classList.remove('hidden');
    document.getElementById('score').textContent = `You scored ${score} out of ${quizData.length}`;
}

document.getElementById('restart-button').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    answerSelected = false;
    document.getElementById('score-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    loadQuestion();
});

// Initialize quiz on page load
loadQuestion();
