// users.js

// Function to fetch users from the API
async function fetchUsers() {
    try {
        const response = await fetch('/api/users'); // Adjust the endpoint as necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json();
        populateUsersTable(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users. Please try again later.');
    }
}

// Function to populate the users table
function populateUsersTable(users) {
    const usersTableBody = document.getElementById('users-table').querySelector('tbody');
    usersTableBody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user._id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.licenseKey}</td>
            <td>
                <button class="edit-btn" data-id="${user._id}">Edit</button>
                <button class="delete-btn" data-id="${user._id}">Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

// Function to handle search functionality
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#users-table tbody tr');

        rows.forEach(row => {
            const username = row.cells[1].textContent.toLowerCase();
            const email = row.cells[2].textContent.toLowerCase();
            if (username.includes(query) || email.includes(query)) {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        });
    });
}

// Function to handle export functionality (to be implemented)
// Function to handle export functionality
function handleExport() {
    const exportBtn = document.getElementById('export-users-btn');
    exportBtn.addEventListener('click', () => {
        window.location.href = '/api/users/export'; // Trigger the export
    });
}
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

// Initialize the page
fetchUsers(); // Fetch users when the page loads
handleSearch(); // Set up search functionality
handleExport(); // Set up export functionality