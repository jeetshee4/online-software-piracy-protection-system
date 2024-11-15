
//mongodb+srv://jeetshee4:jeet9831@cluster0.segoe.mongodb.net/userManagement?retryWrites=true&w=majority

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
require('dotenv').config({ path: './my.env' });

const { User, Admin ,UserActivity ,SecurityAlert } = require('./models');
const app = express();

// MongoDB Connection
// MongoDB Connection
mongoose.connect(my.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// Rest of your existing middleware remains the same
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Generate License Key (keep your existing function)
function generateLicenseKey() {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
}

// Serve the index.html (home page)

app.get('/cron',(req,res)=>{
    return res.json({data: "Test cron job"})
})



//// jeetshree.render.com/cron

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Serve the login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve the admin-register
app.get('/admin-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-register.html'));
});

// Serve the admin-login
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Serve the about.html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Serve the dashboard.html
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
//Serve the admin-dashboard
app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});



// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, deviceId } = req.body;

        // Validate that all required fields are present
        if (!username || !email || !password || !deviceId) {
            return res.status(400).json({
                message: 'All fields are required',
                received: { username, email, password, deviceId }
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            deviceId,
            licenseKey: generateLicenseKey()
        });

        // Save user to database
        await newUser.save();

        console.log('New user registered:', newUser);

        // Log user registration activity
        

        // Send success response
        res.status(201).json({ 
            message: 'User registered successfully!', 
            licenseKey: newUser.licenseKey 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Admin Registration endpoint
app.post('/admin-register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate that all required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                received: { username, email, password }
            });
        }

        // Check if admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        // Create new admin
        const newAdmin = new Admin({
            username,
            email,
            password
        });

        // Save admin to database
        await newAdmin.save();

        console.log('New admin registered:', newAdmin);

        // Send success response
        res.status(201).json({ message: 'Admin registered successfully!' });
    } catch (error) {
        console.error('Admin Registration error:', error);
        res.status(500).json({ message: 'Admin Registration failed', error: error.message });
    }
});

// Fetch all users endpoint
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('username email licenseKey'); // Select relevant fields
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});








// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
                received: { username, password }
            });
        }

        const user = await User.findOne({ username, password });
        if (user) {
            // Log user login activity
            const userActivity = new UserActivity({
                userId: user._id,
                action: 'logged in',
                deviceId: user.deviceId, // Use the user's deviceId from the User model
                ipAddress: req.ip,
                username: user.username,
                email: user.email
            });
            await userActivity.save();



            res.status(200).json({ 
                message: 'Login successful!',
                username: user.username,
                licenseKey: user.licenseKey,
                deviceId: user.deviceId
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Admin Login endpoint
// Admin Login endpoint
app.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate that all required fields are present
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
                received: { username, password }
            });
        }

        // Find the admin by username and password
        const admin = await Admin.findOne({ username, password });
        if (admin) {
            res.status(200).json({ 
                message: 'Admin login successful!',
                username: admin.username
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Admin Login error:', error);
        res.status(500).json({ message: 'Admin login failed', error: error.message });
    }
});

// Fetch user activities endpoint
app.get('/api/user-activities', async (req, res) => {
    try {
        const activities = await UserActivity.find()
            .populate('userId', 'username email') // Populate user details
            .select('action timestamp deviceId ipAddress userId'); // Select relevant fields

        // Format the activities to include username and email
        const formattedActivities = activities.map(activity => ({
            username: activity.userId.username,
            email: activity.userId.email,
            action: activity.action,
            timestamp: activity.timestamp,
            deviceId: activity.deviceId,
            ipAddress: activity.ipAddress
        }));

        res.status(200).json(formattedActivities);
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch security alerts endpoint
app.get('/api/security-alerts', async (req, res) => {
    try {
        const alerts = await SecurityAlert.find().sort({ timestamp: -1 }); // Fetch alerts sorted by timestamp
        res.status(200).json(alerts);
    } catch (error) {
        console.error('Error fetching security alerts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Validate License Key endpoint
// app.post('/validate-license', async (req, res) => {
//     const { username, licenseKey } = req.body;
//     const user = await User.findOne({ username, licenseKey });

//     if (user) {
//         res.json({ valid: true, message: 'License key is valid.' });
//     } else {
//         res.json({ valid: false, message: 'Invalid license key.' });
//     }
// });


// Validate License Key endpoint
app.post('/validate-license', async (req, res) => {
    const { username, licenseKey } = req.body;

    try {
        // Check if the user exists with the provided username and license key
        const user = await User.findOne({ username, licenseKey });

        if (user) {
            // Check for duplicate usage of the license key
            const duplicateUsage = await User.find({ licenseKey, _id: { $ne: user._id } });

            if (duplicateUsage.length > 0) {
                // Create a security alert for duplicate usage
                const alert = new SecurityAlert({
                    alertType: 'Duplicate License Key',
                    description: `License key ${licenseKey} is being used by multiple users.`,
                    timestamp: new Date()
                });
                await alert.save();
            }

            // If the license key is valid, respond with success
            return res.json({ valid: true, message: 'License key is valid.' });
        } else {
            // Create a security alert for invalid key
            const alert = new SecurityAlert({
                alertType: 'Invalid License Key',
                description: `Invalid license key attempt for user ${username}.`,
                timestamp: new Date()
            });
            await alert.save();

            // If the license key is invalid, respond with failure
            return res.json({ valid: false, message: 'Invalid license key.' });
        }
    } catch (error) {
        console.error('Error validating license key:', error);
        return res.status(500).json({ valid: false, message: 'Internal server error' });
    }
});



// Your existing routes for serving HTML files remain the same


app.post('/logout', (req, res) => {
    // In a real app, you might invalidate the session here
    res.json({ message: 'Logged out successfully' });
});




// Export users as CSV
app.get('/api/users/export', async (req, res) => {
    try {
        const users = await User.find().select('username email licenseKey'); // Select relevant fields
        const fields = ['_id', 'username', 'email', 'licenseKey']; // Specify the fields you want to export
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(users);

        res.header('Content-Type', 'text/csv');
        res.attachment('users.csv'); // Set the filename for the download
        res.send(csv); // Send the CSV data as a response
    } catch (error) {
        console.error('Error exporting users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});






// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});









// // Validate License Key endpoint
// app.post('/validate-license', (req, res) => {
//     const { username, licenseKey } = req.body;
//     const user = users.find(u => u.username === username);

//     if (user && user.licenseKey === licenseKey) {
//         res.json({ valid: true, message: 'License key is valid.' });
//     } else {
//         res.json({ valid: false, message: 'Invalid license key.' });
//     }
// });

// Logout endpoint


// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });