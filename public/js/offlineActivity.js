document.addEventListener('DOMContentLoaded', () => {
    //Focus on first input field once loaded
    $('.modal').modal();
    const firstField = document.getElementById('offlineActivityName');
    if (firstField)
        firstField.focus();
    try {

        dataTable = $('#offline-activity-table').DataTable({
            columnDefs: [
                { width: '10%', targets: 0 }, // Column 1 (Index)
                { width: '35%', targets: 1 }, // Column 1 (Activity Name)
                { width: '35%', targets: 2 }, // Column 2 (Points Per Hour)
                { width: '20%', targets: 3 }, // Column 3 (Actions)
            ],
        });
        let ele = $('#offline-activity-table');
        if (ele) {
            fetchOfflineActivities();
        }
    } catch{}
    // Fetch and display offline activities



    // Add Offline Activity
    const offlineActivityForm = document.getElementById('addOfflineActivityForm');
    if (offlineActivityForm) {
        offlineActivityForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            const offlineActivityData = {
                offlineActivityName: firstField.value,
                pointsPerHour: document.getElementById('pointsPerHour').value,
                offlineActivityNameText: firstField.value.toLowerCase()
            };
            try {
                const response = await fetch('/api/offline-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(offlineActivityData),
                })
                const responseText = await response.text();

                console.log('Response from API:' + responseText);

                // Clear the form if post is successful
                if (response.ok) {
                    showAlert(responseText, false);
                    clearForm(offlineActivityForm);
                } else {
                    showAlert(responseText, true);
                }

            } catch (error) {
                console.error('Fetch error:', error);
                showAlert('Network error: ' + error.message, true);
            }
        });
    };


    // Update Offline Activity
    const updateOfflineActivityBtn = document.getElementById('btnUpdateOfflineActivity');
    if (updateOfflineActivityBtn) {
        updateOfflineActivityBtn.addEventListener('click', async () => {
            const objectId = document.getElementById('object_id').value;
            const updateData = {
                offlineActivityName: document.getElementById('updateActivityName').value,
                pointsPerHour: document.getElementById('updatePoints').value,
                offlineActivityNameText: document.getElementById('updateActivityName').value.toLowerCase()
            };

            try {
                const response = await fetch(`/api/update-offlineActivity/${objectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                });
                const responseJson = await response.json();
                


                if (response.ok) {
                    showAlert(responseJson.message, false);
                    M.Modal.getInstance(document.getElementById('updateOfflineActivity')).close();
                    fetchOfflineActivities();
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




const fetchOfflineActivities = async () => {
    try {
        const response = await fetch('/api/list-offlineActivity');
        const data = await response.json();
        populateDataTable(data);
        console.log('Offline activities:', data);
    } catch (error) {
        console.error('Error fetching offline activities:', error);
    }
};

// Populate DataTable
function populateDataTable(data) {
    dataTable.clear(); // Clear existing data in the DataTable

    data.forEach((item, index) => {
        dataTable.row.add([
            index + 1,
            item.offlineActivityName,
            item.pointsPerHour,
            `
            <a href="#updateOfflineActivity" class="btn-small yellow darken-2 modal-trigger" onclick="openUpdateOfflineActivityModal('${item._id}', '${item.offlineActivityName}', '${item.pointsPerHour}')">Edit</a>
            <button class="btn-small red" onclick="deleteOfflineActivity('${item._id}')">Delete</button>
            `,
        ]);
    });

    dataTable.draw(); // Redraw the DataTable
}



// Open Update Modal
function openUpdateOfflineActivityModal(id, name, points) {
    document.getElementById('object_id').value = id;
    document.getElementById('updateActivityName').value = name;
    document.getElementById('updatePoints').value = points;

    // Update labels for Materialize inputs
    M.updateTextFields();

    // Open the modal


}
// Delete Child
async function deleteOfflineActivity(objectId) {
    if (!confirm('Are you sure you want to delete this offline activity?')) return;

    try {
        const response = await fetch(`/api/delete-offlineActivity/${objectId}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok) {
            showAlert('Offline activity deleted successfully!', false);
            fetchOfflineActivities(); // Refresh the table
        } else {
            showAlert('Error deleting child: ' + result.message, true);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showAlert('Network error: ' + error.message, true);
    }
}
