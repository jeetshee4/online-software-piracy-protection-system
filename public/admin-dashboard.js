let currentAdmin = null;

// Function to display admin data (if needed)
// function displayAdminData() {
//     if (currentAdmin) {
//         document.getElementById('admin-username-display').innerText = currentAdmin.username;
//         // Add any other admin-specific data display here
//     }
// }

// Function to fetch user activities
// Function to fetch user activities
async function fetchUser_Activities() {
    try {
        const response = await fetch('/api/user-activities');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const activities = await response.json();
        const activitiesTableBody = document.getElementById('user-activity-table').querySelector('tbody');

        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.username}</td>
                <td>${activity.email}</td>
                <td>${activity.action}</td>
                <td>${new Date(activity.timestamp).toLocaleString()}</td>
                <td>${activity.deviceId}</td>
                <td>${activity.ipAddress}</td>
            `;
            activitiesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user activities:', error);
        // Optionally, display an error message in the UI
    }
}

// Function to fetch security alerts
async function fetchSecurityAlerts() {
    try {
        const response = await fetch('/api/security-alerts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const alerts = await response.json();
        console.log('Fetched alerts:', alerts); // Log the fetched alerts for debugging
        const alertsContainer = document.getElementById('security-alerts');

        // Clear previous alerts and placeholder
        alertsContainer.innerHTML = '';

        if (alerts.length > 0) {
            alerts.forEach(alert => {
                const alertDiv = document.createElement('div');

                // Sanitize alertType to create a valid class name
                const sanitizedAlertType = alert.alertType.replace(/\s+/g, '_'); // Replace spaces with underscores

                alertDiv.classList.add('alert', sanitizedAlertType); // Add alert type class for styling
                alertDiv.innerHTML = `
                    <strong>${alert.alertType}</strong>: ${alert.description} <em>(${new Date(alert.timestamp).toLocaleString()})</em>
                `;
                alertsContainer.appendChild(alertDiv);
            });
        } else {
            // If no alerts, show the placeholder
            alertsContainer.innerHTML = '<p>No security alerts to display.</p>';
        }
    } catch (error) {
        console.error('Error fetching security alerts:', error);
    }
}
// Call the function to fetch alerts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSecurityAlerts(); // Fetch security alerts when the dashboard loads
});

// Redirect to users.html when "View Users" button is clicked
document.getElementById('view-users-btn').addEventListener('click', function() {
    window.location.href = 'users.html'; // Redirect to the users page
});

// Redirect for the second button
document.getElementById('search-users-btn').addEventListener('click', function() {
    window.location.href = 'users.html'; // Redirect to the users page
});

// Redirect for the third button
document.getElementById('export-users-btn').addEventListener('click', function() {
    window.location.href = 'users.html'; // Redirect to the users page
});









// Logout functionality
document.getElementById('logout').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    const response = await fetch('/logout', { method: 'POST' });

    if (response.ok) {
        localStorage.removeItem('currentAdmin'); // Clear admin data from local storage
        window.location.href = '/admin-login.html'; // Redirect to admin login page
    } else {
        console.error('Logout failed:', response.statusText);
        alert('Logout failed. Please try again.'); // Optional: Notify user of failure
    }
});

// Check if admin is logged in
// function checkAdminLoggedIn() {
//     const storedAdmin = localStorage.getItem('currentAdmin');
//     if (storedAdmin) {
//         currentAdmin = JSON.parse(storedAdmin);
//         displayAdminData(); // Display admin data if needed
//     } else {
//         window.location.href = '/admin-login.html'; // Redirect to login if not logged in
//     }
// }

// Call this function when the admin dashboard page loads
// checkAdminLoggedIn();
fetchUser_Activities(); // Fetch user activities when the dashboard loads
fetchSecurityAlerts(); // Fetch security alerts when the dashboard loads