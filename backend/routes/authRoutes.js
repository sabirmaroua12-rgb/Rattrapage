// routes/authRoutes.js
// Routes for authentication (register & login)

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /register - Register a new user
router.post('/register', register);

// POST /login - Authenticate user and receive JWT token
router.post('/login', login);

module.exports = router;
