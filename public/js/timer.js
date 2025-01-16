// Insert code to start the timer, stop the timer and add timer usage record to the database

// Function to get current date in specified timezone (AEDT) as a date-only string
function getCurrentTime() {
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

    // Create a date-only string in YYYY-MM-DD hh:mm 
    return `${year}-${month}-${day} ${hour}:${minute}`
};


function calculateTimeDifference(dateString1, dateString2) {
    // Convert the date strings into Date objects
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = date2 - date1;

    // Convert the difference from milliseconds to minutes
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

    return differenceInMinutes;
};


// Calculate points used based on minutes used and online activity points per hour cost
function calculatePointsUsed(minsUsed, pointsPerHour) {
    if(pointsPerHour) {
        //if online activity selected, use points per hour from that
        return(minsUsed/60*pointsPerHour);
    } else {
        //get default points from child record
        const minutesPerPoint = document.getElementById('minutesPerPoint').value;
        const defaultPointsPerHour = 60/minutesPerPoint;
        return(minsUsed/60*defaultPointsPerHour);
    }
};



//Display available points for selected child (need to adjust this to get remaining points rather than daily allowance, placeholder for now)
async function displayPointsAvailable(optionSelected) {
    const pointsDisplay = document.getElementById('pointsAvailable');
    const minutesPerPoint = document.getElementById('minutesPerPoint');
    const dailyAllowance = document.getElementById('dailyAllowancePoints');

    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        let pointsAvailableToday = selectedOption ? selectedOption.getAttribute('dailyAllowancePoints') : '';
        
        // Check if daily usage document exists, return current balance if it does
        const todayDate = getCurrentTime();
        const usageData = {
            childNameText: selectedOption.value.toLowerCase(),
            startDate: todayDate.substring(0, 10)
        };
        // Construct query parameters
        const queryParams = new URLSearchParams(usageData).toString();
        try {
            // Get daily usage record for selected child
            const response = await fetch(`/api/get-daily-usage?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const dailyUsagePointsAvailable = await response.text();
            if (dailyUsagePointsAvailable) {
                pointsAvailableToday = dailyUsagePointsAvailable;
            } 

            const minsPerPoint = selectedOption ? selectedOption.getAttribute('minutesPerPoint') : '';
            pointsDisplay.innerText = 'Points Available Today : ' + parseFloat(pointsAvailableToday).toFixed(2);
            minutesPerPoint.value = minsPerPoint;
            dailyAllowance.value = pointsAvailableToday;

        } catch (error) {
            console.error('Fetch error:', error);
            showAlert('Network error: ' + error.message, true);

        };


        
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
        document.getElementById('pointsPerHour').value = pointsPerHour;
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
            const response = await fetch('/api/children', {
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
                option.setAttribute('dailyAllowancePoints',child.dailyAllowancePoints);
                option.setAttribute('minutesPerPoint',child.minutesPerPoint);
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
                option.textContent = offlineActivity.offlineActivityName + ' (' + offlineActivity.pointsPerHour + ' points per hour)'; 
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
                option.textContent = onlineActivity.onlineActivityName + ' (' + onlineActivity.pointsPerHour + ' points per hour)'; 
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
    //const firstField = document.getElementById('childNameSelect');
    //firstField.focus(); 
    

    //Populate select lists
    getChildList();
    getOfflineActivityList();
    getOnlineActivityList();


    // Timer forms
    const timerFormDisplay = document.getElementById('timerFormDisplay');
    const timerForm = document.getElementById('timerForm');
    timerFormDisplay.style.display="none";
    const timerStatus = document.getElementById('timerStatus');

    

    // Add event listener to Start the Timer
    if (timerForm) {
        timerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            
            const pointsLeft = document.getElementById('dailyAllowancePoints').value;
            const childName = document.getElementById('childNameSelect').value;


            if (childName != '') { 
                if(parseInt(pointsLeft)>0) {
                    const startDateTime = document.getElementById('startDateTime');
                    startDateTime.value = getCurrentTime();
                    timerStatus.innerText = 'active';
                    showAlert('Timer started at ' + startDateTime.value);

                    // Get values from the editable form
                    const onlineActivityName = document.getElementById('onlineActivityNameSelect').value;
                    const offlineActivityName = document.getElementById('offlineActivityNameSelect').value;
                    const pointsAvailable = document.getElementById('pointsAvailable').innerText;
                    const onlineActivityPointsPerHour = document.getElementById('onlineActivityPointsPerHour').innerText;
                    const offlineActivityPointsPerHour = document.getElementById('offlineActivityPointsPerHour').innerText;

                    // Populate the display form
                    document.getElementById('childNameDisplay').value = childName;
                    document.getElementById('onlineActivityNameDisplay').value = onlineActivityName;
                    document.getElementById('offlineActivityNameDisplay').value = offlineActivityName;
                    document.getElementById('pointsAvailableDisplay').innerText = pointsAvailable;
                    document.getElementById('onlineActivityPointsPerHourDisplay').innerText = onlineActivityPointsPerHour;
                    document.getElementById('offlineActivityPointsPerHourDisplay').innerText = offlineActivityPointsPerHour;

                    // Initialize Materialize labels
                    //M.updateTextFields();

                    // Hide editable form and show display form
                    timerForm.style.display = 'none';
                    timerFormDisplay.style.display = 'block';
                } else {
                    showAlert('There are no available points left today, cannot start the timer.',true);
                };
            } else {
                showAlert('Please select your name',true);
            }
        });
    }


    // Add event listener to Stop the timer

    if (timerFormDisplay) {
        
        timerFormDisplay.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const startDateTime = document.getElementById('startDateTime');
            const childName = document.getElementById('childNameSelect').value;
            const onlineActivity = document.getElementById('onlineActivityNameSelect');
            const offlineActivity = document.getElementById('offlineActivityNameSelect');

            // Online/offline activity selection is optional, populate if it has been selected
            let onlineActivityName='';
            let offlineActivityName='';
            if (onlineActivity) {
                onlineActivityName = onlineActivity.value;
            };
            if (offlineActivity) {
                offlineActivityName = offlineActivity.value;
            };

            const dailyAllowancePoints = document.getElementById('dailyAllowancePoints').value;

            // Calculate screen time usage
            const endTime = getCurrentTime(); 
            const minsUsed = calculateTimeDifference(startDateTime.value, endTime); 
            const pointsPerHour = document.getElementById('pointsPerHour').value;
            const pointsUsed = calculatePointsUsed(minsUsed, pointsPerHour);
  
            // Save timer data
            document.getElementById('endDateTime').value = endTime;

            const timerData = {
                childName: childName,
                onlineActivityName: onlineActivityName,
                offlineActivityName: offlineActivityName,
                startDateTime: document.getElementById('startDateTime').value,
                endDateTime: endTime,
                minsUsed: minsUsed,
                pointsUsed: pointsUsed
            };

                try {
                    // Post timer record to database
                    const timerResponse = await fetch('/api/timer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(timerData),
                    });
                    const timerResponseText = await timerResponse.text();
                
                    // Display response
                    if (timerResponse.ok) {
                        showAlert(timerResponseText,false);
                    } else {
                        showAlert(timerResponseText,true);
                    }

                } catch (error) {
                    console.error('Fetch error:', error);
                    showAlert('Network error: ' + error.message, true);
                };
                     
                try {                      
                    // Update available points
                    const startDate = startDateTime.value.substring(0, 10);
                    const dailyUsageData = {
                        childName: childName,
                        startDate: startDate,
                        pointsUsed: pointsUsed,
                        minsUsed: minsUsed,
                        pointsAvailable: +dailyAllowancePoints-pointsUsed,//will only be used for new dailyUsage records
                        childNameText: childName.toLowerCase()
                    };
                
                    // Post timer record to database
                    const usageResponse = await fetch('/api/daily-usage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dailyUsageData),
                    });
                    const usageResponseText = await usageResponse.text();
                    
                    // Display response
                    if (usageResponse.ok) {
                        // Hide display form and show/reset editable form
                        timerFormDisplay.style.display = 'none';
                        timerForm.style.display = 'block';
                        timerStatus.innerText = '';
                        timerForm.reset();
                    };
                            
                    } catch (error) {
                        console.error('Fetch error:', error);
                        showAlert('Network error: ' + error.message, true);
                    }   
        });
    }
});