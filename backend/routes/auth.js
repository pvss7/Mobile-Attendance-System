const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController'); // Ensure this path is correct

// Login Route
router.post('/login', controller.login);

// Register Route
router.post('/register', controller.register);

module.exports = router;
