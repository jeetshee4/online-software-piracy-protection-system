document.getElementById('admin-registration-form').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Admin registration form submitted');

    // Create an object from form data
    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => { jsonData[key] = value });

    // Log the data being sent
    console.log('Sending admin registration data:', jsonData);

    fetch('/admin-register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        
        // Show success message in a popup
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = data.message;
        document.body.appendChild(popup);
        
        // Clear form after successful submission
        document.getElementById('admin-registration-form').reset();
        
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        const errorPopup = document.createElement('div');
        errorPopup.className = 'popup';
        errorPopup.textContent = error.message;
        document.body.appendChild(errorPopup);
        
        setTimeout(() => {
            document.body.removeChild(errorPopup);
        }, 3000);
    });
});