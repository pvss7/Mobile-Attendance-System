// routes/enrollment.js
const express = require('express');
const router = express.Router(); // Create a router instance
const { authenticateToken } = require('../middleware/authMiddleware'); // Adjust the path as needed
const { enrollStudentInClass } = require('../controllers/enrollmentController'); // Adjust the path as needed

// Define your routes
router.post('/enroll', authenticateToken, enrollStudentInClass);

module.exports = router; // Export the router
