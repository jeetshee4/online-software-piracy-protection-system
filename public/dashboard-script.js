// dashboard-script.js

let currentUser = null;

// Function to display user data
function displayUserData() {
    if (currentUser) {
        document.getElementById('username-display').innerText = currentUser.username;
        document.getElementById('current-license-key').innerText = currentUser.licenseKey;
        // document.getElementById('current-license-key').innerText = licenseKey;

        document.getElementById('device-id-display').innerText = currentUser.deviceId;
    }
}

// Function to validate the license key
async function validateLicenseKey(licenseKey) {
    const response = await fetch('/validate-license', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUser.username, licenseKey }),
    });
    const data = await response.json();
    return data.valid;
}

// Event listener for the license validation form
document.getElementById('validate-license-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const licenseKeyInput = document.getElementById('license-key-input').value;
    const validationResult = await validateLicenseKey(licenseKeyInput);
    
    const validationMessage = document.getElementById('validation-result');
    if (validationResult) {
        validationMessage.innerText = "License key is valid!";
    } else {
        validationMessage.innerText = "Invalid license key. Please try again.";
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetch('/logout', { method: 'POST' });
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
});

// Check if user is logged in
function checkLoggedIn() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        displayUserData();
    } else {
        window.location.href = '/login.html';
    }
}

// Call this function when the dashboard page loads
checkLoggedIn();