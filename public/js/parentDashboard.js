document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);

  });



  async function getChild() {
    try {
        const response = await fetch('http://localhost:3000/api/childList', { method: 'GET' });
        const data = await response.json();

        if (data) {
            data.forEach(child => {
                console.log(child.childName)
                const select = document.getElementById('childSelect');
                select.innerHTML =  `<option value=${child.childName}>${child.childName}</option>`;
                
            });
        } 
    } catch (error) {
        console.log(error)
    }
}


getChild()




let form = document.getElementById("childNameForm");

  form.addEventListener('submit', async(e) => {
    e.preventDefault()
    const name = document.getElementById('childSelect').value;


    try {
        const postLoginData = await fetch('http://localhost:3000/api/parentDashboard', {
            method: 'POST',
            body: JSON.stringify({
                childName:name,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await postLoginData.json()

        const tableBody = document.getElementById('data-table');
            data.forEach(child => {
                const ctx = document.getElementById('usageChart').getContext('2d');
            const usageChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: [2, 4, 6, 8, 10],
                  datasets: [
                    {
                      label: 'Points Used',
                      data: [child.pointsUsed, child.pointsAvailable],
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
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${child.childName}</td>
                    <td>${child.startDate}</td>
                    <td>${child.pointsUsed}</td>
                    <td>${child.pointsAvailable}</td>
                    <td>${child.minsUsed}</td>
                `;
                tableBody.appendChild(row);
            });  
    } catch (error) {
      M.toast({html: `${error}`})
    }    
})







