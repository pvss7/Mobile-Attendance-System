const express = require('express');
const {
  markAttendance,
  getAttendanceRecords,
} = require('../controllers/attendance');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware'); // Import authentication middleware
const { check, validationResult } = require('express-validator');

// Route for marking attendance
router.post(
  '/mark',
  authenticateToken, // Authentication middleware to verify token for student
  [
    check('studentId', 'Student ID is required').notEmpty(),
    check('classId', 'Class ID is required').notEmpty(),
    check(
      'location.latitude',
      'Latitude is required and must be a float'
    ).isFloat(),
    check(
      'location.longitude',
      'Longitude is required and must be a float'
    ).isFloat(),
  ],
  async (req, res) => {
    // Validate request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Call the markAttendance function from attendance controller
    try {
      await markAttendance(req, res); // Directly call the markAttendance function
    } catch (error) {
      console.error('Error in attendance route:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);
router.get('/:studentId', getAttendanceRecords);

module.exports = router;
