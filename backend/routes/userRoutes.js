// routes/userRoutes.js
// Routes for user operations (protected by JWT middleware)

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/authController');

// GET /users - Retrieve all users (protected route)
router.get('/users', authMiddleware, getUsers);

module.exports = router;
