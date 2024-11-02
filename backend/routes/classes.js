const express = require('express');
const router = express.Router();
const {
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getAllClasses,
} = require('../controllers/classController'); // Adjust path if necessary
const {
  authenticateToken,
  authorizeAdmin,
} = require('../middleware/authMiddleware'); // Combined import

// Routes
router.get('/:id', authenticateToken, getClassById); // Get class by ID
router.post('/', authenticateToken, authorizeAdmin, createClass); // Create a new class
router.put('/:id', authenticateToken, authorizeAdmin, updateClass); // Update an existing class
router.delete('/:id', authenticateToken, authorizeAdmin, deleteClass); // Delete a class
router.get('/', authenticateToken, getAllClasses); // Get all classes

module.exports = router; // Export the routers
