const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    deviceId: { 
        type: String, 
        required: true 
    },
    licenseKey: { 
        type: String 
    }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
});

// User Activity Schema
const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['logged in', 'logged out', 'viewed page', 'clicked button', 'other'] // Define possible actions
    },
    timestamp: {
        type: Date,
        default: Date.now // Automatically set the timestamp to the current date
    },
    deviceId: {
        type: String,
        required: true // Assuming deviceId is mandatory
    },
    ipAddress: {
        type: String,
        required: true // Capture the IP address
    },
    username: {
        type: String,
        required: true // Store the username for easy access
    },
    email: {
        type: String,
        required: true // Store the email for easy access
    }
});

//Security Alert Schema
const securityAlertSchema = new mongoose.Schema({
    alertType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Automatically set the timestamp to the current date
    }
});



const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const UserActivity = mongoose.model('User Activity', userActivitySchema);
const SecurityAlert = mongoose.model('SecurityAlert', securityAlertSchema); // New model for Security Alerts


module.exports = { User, Admin ,UserActivity,SecurityAlert };