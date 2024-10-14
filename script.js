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

    AddToWorkoutPlan.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent form submission

        if (validateInputs()) {
            if (exerciseCount < exerciseLimit) {
                const exercise = document.getElementById('Exercise').value;
                const quantity = parseInt(document.getElementById('quantity').value);
                const hours = parseInt(document.getElementById('hours').value.padStart(2, '0'));
                const minutes = parseInt(document.getElementById('minutes').value.padStart(2, '0'));
                const seconds = parseInt(document.getElementById('seconds').value.padStart(2, '0'));
                const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                const exerciseDiv = document.createElement('div');
                exerciseDiv.className = 'exercise-item';
                exerciseDiv.innerHTML = `<p>${exercise} -- ×${quantity}</p><p> ${time}</p> <button class="complete-button" disabled>Complete</button>`;
                
                const completeButton = exerciseDiv.querySelector('.complete-button');
                completeButton.addEventListener('click', async () => {
                    if (timerInterval) clearInterval(timerInterval);
                    exerciseDiv.classList.add('completed');
                    disableButtons();
                    exerciseTimes.push({ name: exercise, plannedTime: time, actualTime: 'Completed Early' });

                    if (currentExerciseIndex < exercises.length - 1) {
                        await startBreak();
                        currentExerciseIndex++;
                        await startExercise(currentExerciseIndex);
                    } else {
                        endWorkout();
                    }
                });

                ExerciseSection.appendChild(exerciseDiv);
                exercises.push({ name: exercise, quantity: quantity, time: time, completeButton: completeButton });
                exerciseCount++;

                // Clear Inputs
                document.getElementById('Exercise').value = '';
                document.getElementById('quantity').value = '';
                document.getElementById('hours').value = '';
                document.getElementById('minutes').value = '';
                document.getElementById('seconds').value = '';
                enableButtons();
            } else {
                alert(`You have reached the limit of ${exerciseLimit} exercises!`);
            }
        }
    });

    beginWorkoutButton.addEventListener('click', async function () {
        if (exercises.length > 0) {
            await startExercise(currentExerciseIndex);
        }
    });

    async function startExercise(index) {
        const currentExercise = exercises[index];
        enableCurrentCompleteButton(index);
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
                disableCurrentCompleteButton(index);

                if (index < exercises.length - 1) {
                    startBreak().then(() => startExercise(index + 1));
                } else {
                    endWorkout();
                }
            }
        }, 1000);
    }

    async function startBreak() {
        currentExerciseDisplay.innerHTML = "Break Time: 20 seconds";
        let breakTime = 20;

        return new Promise((resolve) => {
            timerInterval = setInterval(() => {
                breakTime--;
                currentExerciseDisplay.innerHTML = `Break Time: ${breakTime} seconds`;

                if (breakTime <= 0) {
                    clearInterval(timerInterval);
                    resolve();
                }
            }, 1000);
        });
    }

    function endWorkout() {
        currentExerciseDisplay.innerHTML = "Workout Complete!";
        showResultsButton.style.display = 'block';
    }

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

    function parseTime(time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function displayTimer(exerciseName, totalSeconds) {
        currentExerciseDisplay.innerHTML = `${exerciseName} - ${formatTime(totalSeconds)}`;
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function enableCurrentCompleteButton(index) {
        exercises.forEach((exercise, idx) => {
            exercise.completeButton.disabled = (idx !== index);
        });
    }

    function disableCurrentCompleteButton(index) {
        exercises[index].completeButton.disabled = true;
    }

    function disableButtons() {
        exercises.forEach(exercise => {
            exercise.completeButton.disabled = true;
        });
    }

    function enableButtons() {
        exercises.forEach(exercise => {
            exercise.completeButton.disabled = false;
        });
    }

    // Show Results Button Logic
    showResultsButton.addEventListener('click', function () {
        resultsTable.style.display = 'block';
        resultsBody.innerHTML = exerciseTimes.map(exercise => `
            <tr>
                <td>${exercise.name}</td>
                <td>${exercise.plannedTime}</td>
                <td>${exercise.actualTime}</td>
            </tr>
        `).join('');
    });
});
