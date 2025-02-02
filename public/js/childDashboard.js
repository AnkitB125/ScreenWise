

const ctx = document.getElementById('usageChart').getContext('2d');
let usageChart = null;
async function fetchChildRecords() {
  const childSelector = document.getElementById("child_selector");
  const childName = childSelector.options[childSelector.selectedIndex].value;

  if (!childName) {
    M.toast({ html: 'Please enter a child name.' });
    return;
  }

  try {
    // Fetch child records from the API
    const response = await fetch(`/api/screentimeusage?childName=${childName}`);
    const data = await response.json();

    console.log(data);

    if (response.status === 200) {
      const onlineActivities = data.filter(record => record.onlineActivityName).map(record => record.onlineActivityName);
      const offlineActivities = data.filter(record => record.offlineActivityName).map(record => record.offlineActivityName);
      console.log(onlineActivities, offlineActivities)
      // Clear and update offline activities
      const offlineList = document.getElementById('offlineActivity');
      offlineList.innerHTML = '';
      const offlineOl = document.createElement('ol');
      offlineActivities.forEach(activity => {
        const li = document.createElement('li');
        li.innerText = activity;
        offlineOl.appendChild(li);
      });
      offlineList.appendChild(offlineOl);

      // Clear and update online activities
      const onlineList = document.getElementById('onlineActivity');
      onlineList.innerHTML = '';
      const onlineOl = document.createElement('ol');
      onlineActivities.forEach(activity => {
        const li = document.createElement('li');
        li.innerText = activity;
        onlineOl.appendChild(li);
      });
      onlineList.appendChild(onlineOl);

      chartData = processRecords(data)
      createChart(chartData)
    } else {
      M.toast({ html: data });
    }
  } catch (error) {
    console.error('Error fetching child records:', error);
    M.toast({ html: 'An error occurred while fetching the data.' });
  }
}


function createChart(chartData) {
  if (usageChart){
    usageChart.destroy();
  }
  
  usageChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: getLast7DaysLabels(),
      datasets: [
        {
          label: 'Usage in Hours',
          data: chartData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


function getLast7DaysLabels() {
  const labels = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i); // Subtract days to get past dates
      labels.push(date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })); // Format: "Fri, Jan 25"
  }

  return labels;
}


// Function to filter records and group data by the last 7 days
function processRecords(records) {
  const now = new Date();
  const usageByDay = {};

  // Create a map of the last 7 days with default usage as 0
  const last7DaysLabels = getLast7DaysLabels();
  last7DaysLabels.forEach(label => {
      usageByDay[label] = 0;
  });

  // Filter records for the last 7 days and group by date
  records.forEach(record => {
      const recordDate = new Date(record.startDateTime);
      const diffInDays = (now - recordDate) / (1000 * 60 * 60 * 24); // Difference in days

      if (diffInDays <= 7) {
          const label = recordDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
          if (usageByDay[label] !== undefined) {
              usageByDay[label] += record.minsUsed / 60; // Convert minutes to hours
          }
      }
  });

  // Return the grouped data as an array
  return last7DaysLabels.map(label => usageByDay[label]);
}



async function fetchChilds() {
  // Fetch child records on form submit

  const response = await fetch('/api/childList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const childList = await response.json();
  selectElement = document.getElementById('child_selector');

  // Add the options
  childList.forEach(child => {
    const option = document.createElement('option');
    option.value = child.childName;
    option.setAttribute('dailyAllowancePoints', child.dailyAllowancePoints);
    option.setAttribute('minutesPerPoint', child.minutesPerPoint);
    option.textContent = child.childName;
    selectElement.appendChild(option); // Append the option to the select element
  });

  // Initialize the select element using Materialize CSS
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchChilds();
})


