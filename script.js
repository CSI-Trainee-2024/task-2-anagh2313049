//when the HTML will be Loaded completely then only we will look for further .

document.addEventListener('DOMContentLoaded', function () {
    const AddToWorkoutPlan = document.getElementById('submitExercise');
    // const WorkoutPlan = document.getElementById('begin-Workout');
    const ExerciseSection = document.querySelector('.ExerciseSection');

    AddToWorkoutPlan.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent form submission

        //validation is very necessary nahi toh code phat jayega.
        if (validateInputs()) {
            ExerciseSectionHandler(); 
        }
    });
    
    function ExerciseSectionHandler(e)
    {
        // Capture User Inputs:
        const exercise = document.getElementById('Exercise').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const hours = parseInt(document.getElementById('hours').value.padStart(2, '0'));
        const minutes = parseInt(document.getElementById('minutes').value.padStart(2, '0'));
        const seconds = parseInt(document.getElementById('seconds').value.padStart(2, '0'));

        // Format the Time:
        const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        //a new div for the exercise
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-item';

        // now i will set the innerHTML exercise details
        exerciseDiv.innerHTML = `<p>${exercise} --   ×${quantity}</p><p>  ${time}</p> <button class= "complete-button">Complete</button>`;

        // now i will append it to the exercise section
        ExerciseSection.appendChild(exerciseDiv);

        // once the user details are displayed all the inputs will be emptied so that users can fill new exercise again.
        document.getElementById('Exercise').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('hours').value = '';
        document.getElementById('minutes').value = '';
        document.getElementById('seconds').value = '';

    }

    //function to check validation
    function validateInputs()
    {
        const exercise = document.getElementById('Exercise').value.trim();
        const quantity = parseInt(document.getElementById('quantity').value);
        const hours = parseInt(document.getElementById('hours').value);
        const minutes = parseInt(document.getElementById('minutes').value);
        const seconds = parseInt(document.getElementById('seconds').value);

        // validating Exercise to check that it shouldn't be empty
        if (!exercise) 
        {
            alert('Please enter a valid exercise name.');
            return false;
        }

        // validating quantity
        if (isNaN(quantity) || quantity <= 0) 
        {
            alert('Please enter a valid quantity greater than 0.');
            return false;
        }

        // Validate time fields
        if (isNaN(hours) || hours < 0 || hours > 23) {
            alert('Please enter valid hours (between 0 and 23).');
            return false;
        }

        if (isNaN(minutes) || minutes < 0 || minutes > 59) {
            alert('Please enter valid minutes (between 0 and 59).');
            return false;
        }

        if (isNaN(seconds) || seconds < 0 || seconds > 59) {
            alert('Please enter valid seconds (between 0 and 59).');
            return false;
        }

        return true;

    }

});
