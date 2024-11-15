document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Login form submitted');

    // Create an object from form data
    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => { jsonData[key] = value });

    // Log the data being sent
    console.log('Sending login data:', jsonData);

    fetch('/login', {
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


        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
        username: data.username,
        licenseKey: data.licenseKey,
        deviceId: data.deviceId
    }));

        // Show license key in a popup
        // const popup = document.createElement('div');
        // popup.className = 'popup';
        // popup.textContent = `Login successful! Your license key is: ${data.licenseKey}`;
        // document.body.appendChild(popup);

        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = data.message;
        document.body.appendChild(popup);
        

        // Clear form after successful login
        document.getElementById('login-form').reset();
        
        // Redirect to the dashboard after successful login
        setTimeout(() => {
            document.body.removeChild(popup);
            window.location.href = '/dashboard'; // Redirect to the dashboard page
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