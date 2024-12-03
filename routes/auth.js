const express = require('express');
const router = express.Router();

// Import controller functions
const {
    register,
    login,
  
  
} = require('../controllers/authcontrollers');

// Middleware for authentication and admin routes
const auth = require('../middleware/authmiddleware');
const adminAuth = require('../middleware/adminauthmidele');

// Public routes
router.post('/login', login);       // Login route
router.post('/register', register); // Registration route



  
module.exports = router;
