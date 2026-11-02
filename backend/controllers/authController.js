// controllers/authController.js
// Business logic for user registration, login, and user retrieval

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check that all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    // 2. Check whether the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // 3. Hash the password using bcryptjs (cost factor 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Save the user in SQLite database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5 & 6. Never return the password; return success message and user information
    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // 7. Handle errors properly
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// Log in an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check that email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Search for the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 3. Compare the password using bcryptjs.compare()
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // 4. Return an error if credentials are incorrect
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 5. Generate a JWT token (valid for 24 hours)
    const secretKey = process.env.JWT_SECRET || 'my_simple_secret_key_12345';
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secretKey,
      { expiresIn: '24h' }
    );

    // 6. Return the token and user information without the password
    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// Retrieve all users (Protected route)
const getUsers = async (req, res) => {
  try {
    // Retrieve all users from SQLite, excluding password
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
    });

    // Return users in JSON format
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching users.', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUsers,
};
