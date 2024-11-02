// routes/students.js
const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController'); // Adjust path if necessary
const {
  authenticateToken,
  authorizeAdmin,
} = require('../middleware/authMiddleware');
// Define the routes for students
router.get('/', authenticateToken, getAllStudents); // Get all students
router.get('/:id', authenticateToken, getStudentById); // Get student by ID
router.post('/', authenticateToken, createStudent); // Create a new student
router.put('/:id', authenticateToken, updateStudent); // Update an existing student
router.delete('/:id', authenticateToken, deleteStudent); // Delete a student

module.exports = router; // Export the router
