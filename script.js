document.addEventListener('DOMContentLoaded', function () {
    const AddToWorkoutPlan = document.getElementById('submitExercise');
    const beginWorkoutButton = document.getElementById('begin-Workout');
    const ExerciseSection = document.querySelector('.ExerciseSection');
    const currentExerciseDisplay = document.getElementById('currentExerciseDisplay');
    const showResultsButton = document.getElementById('showResultsButton');
    const resultsTable = document.getElementById('resultsTable');
    const resultsBody = document.getElementById('resultsBody');
    let exercises = [];
    let exerciseTimes = [];
    let currentExerciseIndex = 0;
    let exerciseCount = 0;
    let timerInterval;

    const exerciseLimit = 5;

    // Adding Exercises to the Workout Plan
    AddToWorkoutPlan.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent form submission

        if (validateInputs()) {
            if (exerciseCount < exerciseLimit) {
                ExerciseSectionHandler();
                exerciseCount++;
            } else {
                alert(`You have reached the limit of ${exerciseLimit} exercises!`);
            }
        }
    });

    function ExerciseSectionHandler() {
        // Capture User Inputs:
        const exercise = document.getElementById('Exercise').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const hours = parseInt(document.getElementById('hours').value.padStart(2, '0'));
        const minutes = parseInt(document.getElementById('minutes').value.padStart(2, '0'));
        const seconds = parseInt(document.getElementById('seconds').value.padStart(2, '0'));

        const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Create Exercise Div
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-item';
        exerciseDiv.innerHTML = `<p>${exercise} -- ×${quantity}</p><p> ${time}</p> <button class="complete-button">Complete</button>`;
        
        const completeButton = exerciseDiv.querySelector('.complete-button');
        completeButton.addEventListener('click', function () {
            markExerciseComplete(currentExerciseIndex, exerciseDiv);
        });

        ExerciseSection.appendChild(exerciseDiv);

        // Clear Inputs
        document.getElementById('Exercise').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('hours').value = '';
        document.getElementById('minutes').value = '';
        document.getElementById('seconds').value = '';

        // Push Exercise into Array
        exercises.push({
            name: exercise,
            quantity: quantity,
            time: time,
            completed: false
        });
    }

    // Begin Workout
    beginWorkoutButton.addEventListener('click', function () {
        if (exercises.length > 0) {
            startExercise(currentExerciseIndex);
        }
    });

    function startExercise(index) {
        const currentExercise = exercises[index];
        let totalSeconds = parseTime(currentExercise.time); 
        displayTimer(currentExercise.name, totalSeconds);
    
        timerInterval = setInterval(() => {
            totalSeconds--;
            displayTimer(currentExercise.name, totalSeconds); 
    
            if (totalSeconds <= 0) {
                clearInterval(timerInterval); 
                exerciseTimes.push({
                    name: currentExercise.name, 
                    plannedTime: currentExercise.time, 
                    actualTime: formatTime(parseTime(currentExercise.time) - totalSeconds)
                });
    
                if (index < exercises.length - 1) {
                    startBreak(index + 1); 
                } else {
                    endWorkout(); 
                }
            }
        }, 1000); 
    }
    

    function startBreak(nextIndex) {
        currentExerciseDisplay.innerHTML = "Break Time: 20 seconds";
        let breakTime = 20;

        timerInterval = setInterval(() => {
            breakTime--;
            currentExerciseDisplay.innerHTML = `Break Time: ${breakTime} seconds`;

            if (breakTime <= 0) {
                clearInterval(timerInterval);
                startExercise(nextIndex);
            }
        }, 1000);
    }

    function endWorkout() {
        currentExerciseDisplay.innerHTML = "Workout Complete!";
        showResultsButton.style.display = 'block';
    }

    function markExerciseComplete(index, exerciseDiv) {
        clearInterval(timerInterval);
        exerciseDiv.classList.add('completed');
        exerciseTimes.push({
            name: exercises[index].name,
            plannedTime: exercises[index].time,
            actualTime: 'Completed Early'
        });

        if (index < exercises.length - 1) {
            startBreak(index + 1);
        } else {
            endWorkout();
        }
    }

    // Show Results Button Logic
    document.getElementById('showResults').addEventListener('click', function () {
        resultsTable.style.display = 'block';
        resultsBody.innerHTML = exerciseTimes.map(exercise => `
            <tr>
                <td>${exercise.name}</td>
                <td>${exercise.plannedTime}</td>
                <td>${exercise.actualTime}</td>
            </tr>
        `).join('');
    });

    function parseTime(time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function displayTimer(exerciseName, totalSeconds) {
        currentExerciseDisplay.innerHTML = `${exerciseName} - ${formatTime(totalSeconds)}`;
    }

    function startTimer(totalSeconds, onUpdate) {
        let elapsedSeconds = 0;
        return setInterval(() => {
            elapsedSeconds++;
            onUpdate(elapsedSeconds);
        }, 1000);
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Validation Function
    function validateInputs() {
        const exercise = document.getElementById('Exercise').value.trim();
        const quantity = parseInt(document.getElementById('quantity').value);
        const hours = parseInt(document.getElementById('hours').value);
        const minutes = parseInt(document.getElementById('minutes').value);
        const seconds = parseInt(document.getElementById('seconds').value);

        if (!exercise || isNaN(quantity) || quantity <= 0 || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            alert('Please enter valid inputs.');
            return false;
        }

        return true;
    }
});
