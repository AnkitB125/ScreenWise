document.addEventListener('DOMContentLoaded', () => {
    //Focus on first input field once loaded
    $('.modal').modal();
    const firstField = document.getElementById('onlineActivityName');
    if (firstField)
        firstField.focus();

    try {

        dataTable = $('#online-activity-table').DataTable({
            columnDefs: [
                { width: '10%', targets: 0 }, // Column 1 (Index)
                { width: '35%', targets: 1 }, // Column 1 (Activity Name)
                { width: '35%', targets: 2 }, // Column 2 (Points Per Hour)
                { width: '20%', targets: 3 }, // Column 3 (Actions)
            ],
        });
        let ele = $('#online-activity-table');
        if (ele) {
            fetchOnlineActivities();
        }
    } catch{}

    // Add Online Activity Form
    const onlineActivityForm = document.getElementById('addOnlineActivityForm');
    if (onlineActivityForm) {
        onlineActivityForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            const onlineActivityData = {
                onlineActivityName: document.getElementById('onlineActivityName').value,
                pointsPerHour: document.getElementById('pointsPerHour').value,
                onlineActityNameText: document.getElementById('onlineActivityName').value.toLowerCase()
            };
            try {
                const response = await fetch('/api/online-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(onlineActivityData),
                })
                const responseText = await response.text();

                console.log('Response from API:' + responseText);

                // Clear the form if post is successful
                if (response.ok) {
                    showAlert(responseText, false);
                    clearForm(onlineActivityForm);
                } else {
                    showAlert(responseText, true);
                }

            } catch (error) {
                console.error('Fetch error:', error);
                showAlert('Network error: ' + error.message, true);
            }
        });
    };


    // Update Online Activity
    const updateOnlineActivityBtn = document.getElementById('btnUpdateOnlineActivity');
    if (updateOnlineActivityBtn) {
        updateOnlineActivityBtn.addEventListener('click', async () => {
            const objectId = document.getElementById('object_id').value;
            const updateData = {
                onlineActivityName: document.getElementById('updateActivityName').value,
                pointsPerHour: document.getElementById('updatePoints').value,
                onlineActivityNameText: document.getElementById('updateActivityName').value.toLowerCase()
            };

            try {
                const response = await fetch(`/api/update-onlineActivity/${objectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                });
                const responseJson = await response.json();
                


                if (response.ok) {
                    showAlert(responseJson.message, false);
                    M.Modal.getInstance(document.getElementById('updateOnlineActivity')).close();
                    fetchOnlineActivities();
                } else {
                    showAlert(responseJson.message, true);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                showAlert('Network error: ' + error.message, true);
            }
        });
    }

});



const fetchOnlineActivities = async () => {
    try {
        const response = await fetch('/api/list-onlineActivity');
        const data = await response.json();
        populateDataTable(data);
    } catch (error) {
        console.error('Error fetching online activities:', error);
    }
};

// Populate DataTable
function populateDataTable(data) {
    dataTable.clear(); // Clear existing data in the DataTable

    data.forEach((item, index) => {
        dataTable.row.add([
            index + 1,
            item.onlineActivityName,
            item.pointsPerHour,
            `
            <a href="#updateOnlineActivity" class="btn-small yellow darken-2 modal-trigger" onclick="openUpdateOnlineActivityModal('${item._id}', '${item.onlineActivityName}', '${item.pointsPerHour}')">Edit</a>
            <button class="btn-small red" onclick="deleteOnlineActivity('${item._id}')">Delete</button>
            `,
        ]);
    });

    dataTable.draw(); // Redraw the DataTable
}



// Open Update Modal
function openUpdateOnlineActivityModal(id, name, points) {
    document.getElementById('object_id').value = id;
    document.getElementById('updateActivityName').value = name;
    document.getElementById('updatePoints').value = points;

    // Update labels for Materialize inputs
    M.updateTextFields();

    // Open the modal


}
// Delete Child
async function deleteOnlineActivity(objectId) {
    if (!confirm('Are you sure you want to delete this online activity?')) return;

    try {
        const response = await fetch(`/api/delete-onlineActivity/${objectId}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok) {
            showAlert('Online activity deleted successfully!', false);
            fetchOnlineActivities(); // Refresh the table
        } else {
            showAlert('Error deleting child: ' + result.message, true);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showAlert('Network error: ' + error.message, true);
    }
}
