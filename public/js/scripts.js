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
});


