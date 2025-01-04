// Insert code to start the timer, stop the timer and add timer usage record to the database

// Function to get current date in specified timezone (AEDT) as a date-only string
function getCurrentDate() {
    // Create a new Date object for the current date and time
    const date = new Date();

    // Format the date to the specified timezone (Australia/Sydney)
    const options = {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
    };

    const formatter = new Intl.DateTimeFormat('en-AU', options);
    const parts = formatter.formatToParts(date);
    
    // Extract year, month, and day
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;

    // Create a date-only string in YYYY-MM-DD hh:mm format
    return `${year}-${month}-${day} ${hour}:${minute}`
};


//Display available points for selected child (need to adjust this to get remaining points rather than daily allowance, placeholder for now)
function displayPointsAvailable(optionSelected) {
    const pointsDisplay = document.getElementById('pointsAvailable');

    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        const pointsAvailable = selectedOption ? selectedOption.getAttribute('pointsAvailable') : '';
        pointsDisplay.innerText = 'Points available today: ' + pointsAvailable;
    } else {
        pointsDisplay.innerText = '';
    };

};


// Display selected online activity points per hour
function displayOnlineActivityPointsPerHour(optionSelected) {
    
    const pointsDisplay = document.getElementById('onlineActivityPointsPerHour');

    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        const pointsPerHour = selectedOption ? selectedOption.getAttribute('pointsPerHour') : '';
        pointsDisplay.innerText = 'Points per hour for ' + optionSelected.value + ': ' + pointsPerHour;
    } else {
        pointsDisplay.innerText = '';
    };

};


// Display selected offline activity points per hour
function displayOfflineActivityPointsPerHour(optionSelected) {

    const pointsDisplay = document.getElementById('offlineActivityPointsPerHour');

    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        const pointsPerHour = selectedOption ? selectedOption.getAttribute('pointsPerHour') : '';
        pointsDisplay.innerText = 'Points per hour earned for ' + optionSelected.value + ': ' + pointsPerHour;
    } else {
        pointsDisplay.innerText = '';
    };

};


// Populate list of childName options for selection
async function getChildList() {
    const selectElement = document.getElementById('childNameSelect');
    if (selectElement) {
        try {
            const response = await fetch('/api/list-child', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const childList = await response.json();
        

            // Add the options
            childList.forEach(child => {
                const option = document.createElement('option');
                option.value = child.childName; 
                option.setAttribute('pointsAvailable',child.dailyAllowancePoints);
                option.textContent = child.childName; 
                selectElement.appendChild(option); // Append the option to the select element
            });
    
            // Initialize the select element using Materialize CSS
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);

        } catch (error) {
            console.error('Fetch error:', error);
            showAlert('Network error: ' + error.message, true);
        };
    };
};


// Populate list of offline activity options for selection
async function getOfflineActivityList() {
    const selectElement = document.getElementById('offlineActivityNameSelect');
    if (selectElement) {
        try {
            // Get list from db
            const response = await fetch('/api/list-offlineActivity', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const offlineActivityList = await response.json();

            while (selectElement.options.length > 1) {
                selectElement.remove(1); // Remove from index 1 to keep the default option
            }

            // Add the options
            offlineActivityList.forEach(offlineActivity => {
                const option = document.createElement('option');
                option.value = offlineActivity.offlineActivityName; 
                option.setAttribute('pointsPerHour',offlineActivity.pointsPerHour);
                option.textContent = offlineActivity.offlineActivityName; 
                selectElement.appendChild(option); // Append the option to the select element
            });
           
            // Initialize the select element using Materialize CSS
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);

        } catch (error) {
               console.error('Fetch error:', error);
               showAlert('Network error: ' + error.message, true);
        };
    };
};


// Populate list of online activity options for selection
async function getOnlineActivityList() {
    const selectElement = document.getElementById('onlineActivityNameSelect');
    if (selectElement) {
        try {
            // Get list from db
            const response = await fetch('/api/list-onlineActivity', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const onlineActivityList = await response.json();
                
            // Add the options
            onlineActivityList.forEach(onlineActivity => {
                const option = document.createElement('option');
                option.value = onlineActivity.onlineActivityName; 
                option.setAttribute('pointsPerHour',onlineActivity.pointsPerHour);
                option.textContent = onlineActivity.onlineActivityName; 
                selectElement.appendChild(option); // Append the option to the select element
            });
           
            // Initialize the select element using Materialize CSS
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);

        } catch (error) {
               console.error('Fetch error:', error);
               showAlert('Network error: ' + error.message, true);
        };
    };
};

document.addEventListener('DOMContentLoaded', () => {

    //Focus on first input field once loaded
    const firstField = document.getElementById('childNameSelect');
    firstField.focus(); 
    

    //Populate select lists
    getChildList();
    getOfflineActivityList();
    getOnlineActivityList();

    // Add event listener for Start Timer Form submission 
    const timerForm = document.getElementById('timerForm');
    if (timerForm) {
        const childNameSelect = document.getElementById('childNameSelect');
        const onlineActivityNameSelect = document.getElementById('onlineActivityNameSelect');
        const offlineActivityNameSelect = document.getElementById('offlineActivityNameSelect');

        timerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const timerStatus = document.getElementById('timerStatus')
            if (timerStatus.innerText == 'active') {
                const timerData = {
                    childName: childNameSelect.value,
                    onlineActivityName: onlineActivityNameSelect.value,
                    offlineActivityName: offlineActivityNameSelect.value,
                    startDateTime: document.getElementById('startDateTime').value,
                    endDateTime: getCurrentDate()
                };

                try {
                    const response = await fetch('/api/timer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(timerData),
                    });
                    const responseText = await response.text();
                

                    // Display response
                    if (response.ok) {
                        showAlert(responseText,false);
                    } else {
                        showAlert(responseText,true);
                    }

                    //Reload Form
                    timerStatus.innerText = '';
                    timerForm.reset();
                    

                } catch (error) {
                    console.error('Fetch error:', error);
                    showAlert('Network error: ' + error.message, true);
                } 
            } else {
                const startDateTime = document.getElementById('startDateTime');
                startDateTime.value = getCurrentDate();
                timerStatus.innerText = 'active';
                showAlert('Timer started at ' + startDateTime.value);
            }
        });

        let button = document.getElementById('btnSubmit');
        let isClicked = false;

        button.addEventListener('click', function() {
 
            isClicked = !isClicked; // Toggle the state
            if (isClicked) {
                button.textContent = 'Stop Timer';
                document.getElementById('childNameSelect').disabled = true;
            } else {
                button.textContent = 'Start Timer';
                document.getElementById('childNameSelect').disabled = false;
            }
        });
    }
});