// Display messages
function showAlert(message,isError) {
    if (isError) {
        alertBox = document.getElementById('messageError');
        alertBoxClear = document.getElementById('messageOk')
    } else {
        alertBox = document.getElementById('messageOk');
        alertBoxClear = document.getElementById('messageError');
    };
    alertBox.innerText = message;
    alertBoxClear.innerText = '';
};

// Clear input form fields
function clearForm(form) {
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.value = ''; // Clear the value of each input
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false; // Uncheck checkboxes and radio buttons
            }
        });
    }
    // Clear span text values
    const spans = form.querySelectorAll('span');
    spans.forEach(span => {
        span.textContent = ''; // Clear the text content of each span
    });
};

document.addEventListener('DOMContentLoaded', () => {
    
    // Return to Main Menu
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {    
        btnBack.addEventListener('click', () => {
            window.history.back();
        });
    };
    
    // Display Add Child Form
    const btnAddChildForm = document.getElementById('btnAddChildForm');
    if (btnAddChildForm) {    
        btnAddChildForm.addEventListener('click', () => {
            window.location.href='child.html';
        });
    };

    const listChildList = document.getElementById('listChildList');
    if (listChildList) {    
        listChildList.addEventListener('click', () => {
            window.location.href='listChild.html';
        });
    };

    const openAddOfflineActivity = document.getElementById('openAddOfflineActivity');
    if (openAddOfflineActivity) {    
        openAddOfflineActivity.addEventListener('click', () => {
            window.location.href='offlineActivity.html';
        });
    };

    const openListOfflineActivity = document.getElementById('openListOfflineActivity');
    if (openListOfflineActivity) {    
        openListOfflineActivity.addEventListener('click', () => {
            window.location.href='listOfflineActivity.html';
        });
    };

    // Display Add Offline Activity Form
    const btnAddOfflineActivityForm = document.getElementById('btnAddOfflineActivityForm');
    if (btnAddOfflineActivityForm) {    
        btnAddOfflineActivityForm.addEventListener('click', () => {
            window.location.href='offlineActivity.html';
        });
    };

    // Display Add Timer Form
    const btnTimerForm = document.getElementById('btnTimerForm');
    if (btnTimerForm) {    
        btnTimerForm.addEventListener('click', () => {
            window.location.href='timer.html';
        });
    };
    
    // Display Add Online Activity Form
    const btnAddOnlineActivityForm = document.getElementById('btnAddOnlineActivityForm');
    if (btnAddOnlineActivityForm) {    
        btnAddOnlineActivityForm.addEventListener('click', () => {
            window.location.href='onlineActivity.html';
        });
    };

    const openAddOnlineActivity = document.getElementById('openAddOnlineActivity');
    if (openAddOnlineActivity) {    
        openAddOnlineActivity.addEventListener('click', () => {
            window.location.href='onlineActivity.html';
        });
    };

    const openListOnlineActivity = document.getElementById('openListOnlineActivity');
    if (openListOnlineActivity) {    
        openListOnlineActivity.addEventListener('click', () => {
            window.location.href='listOnlineActivity.html';
        });
    };
    const childDashboard = document.getElementById('btnChildDashboard');
    if (childDashboard) {    
        childDashboard.addEventListener('click', () => {
            window.location.href='childDashboard.html';
        });
    };


const childScreenTime = document.getElementById('btnChildScreenTime');
    if (childScreenTime) {    
        childScreenTime.addEventListener('click', () => {
            window.location.href='childScreenTime.html';
        });
    };

});

