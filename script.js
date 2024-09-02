const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');

const resultElement = document.getElementById('result');
const testListElement = document.getElementById('test-list');
const toggleSidebarButton = document.getElementById('toggle-sidebar');
const sidebar = document.querySelector('.sidebar');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');

let currentQuestionIndex = 0;
let score = 0;
let currentTestIndex = 0;
const questionsPerTest = 10;  // Number of questions per test
const testsPerPage = 10;      // Number of tests to show per page
let currentPage = 1;          // Current page of the test list
let tests = [];               // Array to hold sets of 30 questions

// Load quiz data from external JSON file
function loadQuizData() {
    fetch('full.json') // Replace 'questions.json' with the actual path to your JSON file
        .then(response => response.json())
        .then(data => {
            splitIntoTests(data);
            renderTestList(); // Ensure the first page is rendered correctly
            updatePaginationControls(); // Initialize the pagination controls
        })
        .catch(error => console.error('Error loading quiz data:', error));
}

// Split the full list of questions into sets of 30 questions each
function splitIntoTests(questions) {
    const totalTests = Math.ceil(questions.length / questionsPerTest);
    for (let i = 0; i < totalTests; i++) {
        tests.push(questions.slice(i * questionsPerTest, (i + 1) * questionsPerTest));
    }
}

// Function to render tests for the current page
function renderTestList() {
    testListElement.innerHTML = '';  // Clear existing test list
    const start = (currentPage - 1) * testsPerPage;
    const end = start + testsPerPage;
    const paginatedTests = tests.slice(start, end);

    paginatedTests.forEach((_, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Test ${start + index + 1}`;
        listItem.addEventListener('click', () => loadTest(start + index));
        testListElement.appendChild(listItem);
    });
}

// Function to update the pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(tests.length / testsPerPage);

    document.getElementById('page-number').textContent = currentPage;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Function to handle pagination button clicks
function changePage(direction) {
    currentPage += direction;
    renderTestList();
    updatePaginationControls();
}

document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
document.getElementById('next-page').addEventListener('click', () => changePage(1));

function loadTest(testIndex) {
    currentTestIndex = testIndex;
    currentQuestionIndex = 0;
    score = 0;
    questionContainer.style.display = 'block'; // Make sure the question container is visible
    loadQuestion();
}




// Initialize the test list in the sidebar with pagination
function initializeTests() {
    renderTestList();
    updatePaginationControls();
}

















// Split the full list of questions into sets of 30 questions each
function splitIntoTests(questions) {
    const totalTests = Math.ceil(questions.length / questionsPerTest);
    for (let i = 0; i < totalTests; i++) {
        tests.push(questions.slice(i * questionsPerTest, (i + 1) * questionsPerTest));
    }
}

// Initialize the test list in the sidebar
function initializeTests() {
    for (let i = 0; i < tests.length; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = `Test ${i + 1}`;
        listItem.addEventListener('click', () => loadTest(i));
        testListElement.appendChild(listItem);
    }
}

// Load a specific test based on its index
function loadTest(testIndex) {
    currentTestIndex = testIndex;
    currentQuestionIndex = 0;
    score = 0;
    questionContainer.style.display = 'block'; // Make sure the question container is visible
    loadQuestion();
}



// Modify loadQuestion to manage button visibility
function loadQuestion() {
    if (currentQuestionIndex < tests[currentTestIndex].length) {
        const question = tests[currentTestIndex][currentQuestionIndex];
        questionElement.textContent = `${question.question_number}. ${question.question}`;
        optionsElement.innerHTML = '';

        for (const [key, value] of Object.entries(question.options)) {
            const option = document.createElement('div');
            option.classList.add('option');
            option.textContent = `${key}) ${value}`;
            option.addEventListener('click', () => selectOption(option, key));
            optionsElement.appendChild(option);
        }

        prevButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none';  // Show 'Previous' if not the first question
        nextButton.style.display = 'none';  // Hide 'Next' until an option is selected
        resultElement.textContent = '';
    } else {
        showResult();
    }
}




// Move to the next question or show the result if the test is complete
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < tests[currentTestIndex].length) {
        loadQuestion();
    } else {
        showResult();
    }
}

// Go back to the previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

prevButton.addEventListener('click', prevQuestion);
nextButton.addEventListener('click', nextQuestion);

function selectOption(selectedOption, selectedKey) {
    const options = optionsElement.getElementsByClassName('option');
    for (const option of options) {
        option.removeEventListener('click', selectOption);
    }

    const question = tests[currentTestIndex][currentQuestionIndex];
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











// Get the index of the correct option
function getOptionIndex(optionKey) {
    return optionKey.charCodeAt(0) - 96;
}

// Move to the next question or show the result if the test is complete
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < tests[currentTestIndex].length) {
        loadQuestion();
    } else {
        showResult();
    }
}

// Show the result after each test
function showResult() {
    const totalQuestions = tests[currentTestIndex].length;
    questionContainer.style.display = 'none';
    resultElement.textContent = `You scored ${score} out of ${totalQuestions}`;
    nextButton.textContent = currentTestIndex < tests.length - 1 ? 'Next Test' : 'Finish';
    nextButton.removeEventListener('click', nextQuestion); // Remove any previous listeners to prevent stacking
    nextButton.addEventListener('click', moveToNextTest); // Correctly add the listener for moving to the next test
    nextButton.style.display = 'block';
}

// Move to the next test or finish the quiz
function moveToNextTest() {
    currentTestIndex++;
    if (currentTestIndex < tests.length) {
        loadTest(currentTestIndex); // Load the next test
        nextButton.textContent = 'Next';
        nextButton.removeEventListener('click', moveToNextTest); // Remove current listener to prevent stacking
        nextButton.addEventListener('click', nextQuestion); // Add listener back for normal next question progression
    } else {
        resultElement.textContent = 'Congratulations! You have completed all tests.';
        nextButton.style.display = 'none';
    }
}

// Toggle sidebar visibility
function toggleSidebar() {
    sidebar.classList.toggle('show');
}

nextButton.addEventListener('click', nextQuestion);
toggleSidebarButton.addEventListener('click', toggleSidebar);

// Initial call to load the quiz data
loadQuizData();
