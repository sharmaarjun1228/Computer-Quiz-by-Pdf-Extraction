const quizData = [
    // Your JSON data will be loaded here
];

const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultElement = document.getElementById('result');
const testListElement = document.getElementById('test-list');
const toggleSidebarButton = document.getElementById('toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

let currentQuestion = 0;
let score = 0;
let currentTest = 0;
const questionsPerTest = 30;
let tests = [];

function loadQuizData() {
    fetch('full.json')
        .then(response => response.json())
        .then(data => {
            quizData.push(...data);
            initializeTests();
            loadTest(currentTest);
        })
        .catch(error => console.error('Error loading quiz data:', error));
}

function initializeTests() {
    const totalTests = Math.ceil(quizData.length / questionsPerTest);
    for (let i = 0; i < totalTests; i++) {
        tests.push(quizData.slice(i * questionsPerTest, (i + 1) * questionsPerTest));
        const listItem = document.createElement('li');
        listItem.textContent = `Test ${i + 1}`;
        listItem.addEventListener('click', () => loadTest(i));
        testListElement.appendChild(listItem);
    }
}

function loadTest(testIndex) {
    currentTest = testIndex;
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    questionContainer.style.display = 'block';
    const question = tests[currentTest][currentQuestion];
    questionElement.textContent = `${question.question_number}. ${question.question}`;
    optionsElement.innerHTML = '';

    for (const [key, value] of Object.entries(question.options)) {
        const option = document.createElement('div');
        option.classList.add('option');
        option.textContent = `${key}) ${value}`;
        option.addEventListener('click', () => selectOption(option, key));
        optionsElement.appendChild(option);
    }

    nextButton.style.display = 'none';
    resultElement.textContent = '';
}

function selectOption(selectedOption, selectedKey) {
    const options = optionsElement.getElementsByClassName('option');
    for (const option of options) {
        option.removeEventListener('click', selectOption);
    }

    const question = tests[currentTest][currentQuestion];
    const correctAnswer = question.answer;

    if (selectedKey.toLowerCase() === correctAnswer) {
        score++;
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('incorrect');
        optionsElement.querySelector(`.option:nth-child(${getOptionIndex(correctAnswer)})`).classList.add('correct');
    }

    nextButton.style.display = 'block';
}

function getOptionIndex(optionKey) {
    return optionKey.charCodeAt(0) - 96;
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < tests[currentTest].length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const totalQuestions = tests[currentTest].length;
    questionContainer.style.display = 'none';
    resultElement.textContent = `You scored ${score} out of ${totalQuestions}`;
    nextButton.textContent = 'Next Test';
    nextButton.removeEventListener('click', nextQuestion);
    nextButton.addEventListener('click', moveToNextTest);
    nextButton.style.display = 'block';
}

function moveToNextTest() {
    currentTest++;
    if (currentTest < tests.length) {
        loadTest(currentTest);
        nextButton.textContent = 'Next';
        nextButton.removeEventListener('click', moveToNextTest);
        nextButton.addEventListener('click', nextQuestion);
    } else {
        resultElement.textContent = 'Congratulations! You have completed all tests.';
        nextButton.style.display = 'none';
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('show');
}

nextButton.addEventListener('click', nextQuestion);
toggleSidebarButton.addEventListener('click', toggleSidebar);

loadQuizData();