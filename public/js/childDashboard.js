let form = document.getElementById("childNameForm");
let offlineActivity = document.getElementById("offlineActivity");
let onlineActivity = document.getElementById("onlineActivity");
let overTimeName =  document.getElementById("overTime");

  form.addEventListener('submit', async(e) => {
    e.preventDefault()

    let name =  document.getElementById("child").value

    try {
        const postLoginData = await fetch('http://localhost:3000/api/childDashboard', {
            method: 'POST',
            body: JSON.stringify({
                childName:name,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await postLoginData.json()
        const offlineActivityItem = document.createElement("li") 
        const onlineActivityItem = document.createElement("li") 
        offlineActivityItem.classList = "collection-item"
        onlineActivityItem.classList = "collection-item"
        const overTimeTag = document.createElement("span") 
        overTimeTag.classList = "card-title"
        if(data){
          data.forEach(item => {

            if(item.minsUsed >= 2){
              overTimeTag.textContent = `${item.childName} Overtime detected`
              overTimeName.insertBefore(overTimeTag, overTimeName.lastElementChild)
              const ctx = document.getElementById('usageChart').getContext('2d');
              const usageChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: [item.startDateTime, item.endDateTime],
                  datasets: [
                    {
                      label: `${item.childName} Usage in Mins`,
                      data: [2, 4, 6, 8, 10],
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
            } else if(item.minsUsed <= 2){
              overTimeTag.textContent = `${item.childName} No overtime detected`
              overTimeName.insertBefore(overTimeTag, overTimeName.lastElementChild)
              const ctx = document.getElementById('usageChart').getContext('2d');
              const usageChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: [item.startDateTime, item.endDateTime],
                  datasets: [
                    {
                      label: `${item.childName} Usage in Mins`,
                      data: [2, 4, 6, 8, 10],
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

            



            console.log(typeof(item.minsUsed))
            offlineActivityItem.textContent = item.offlineActivityName
            offlineActivity.insertBefore(offlineActivityItem, offlineActivity.lastElementChild)
            onlineActivityItem.textContent = item.onlineActivityName
            onlineActivity.insertBefore(onlineActivityItem, onlineActivity.lastElementChild)
          });
        }
       
        
    } catch (error) {
      M.toast({html: `${error}`})
    }    
})







