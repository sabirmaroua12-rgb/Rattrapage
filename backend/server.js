// server.js
// Main entry point for the backend Express application

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable CORS for mobile application requests
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// API Routes
// Mount authentication routes: POST /register, POST /login
app.use('/', authRoutes);
// Mount user routes: GET /users
app.use('/', userRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Simple Auth API is up and running!' });
});

// Synchronize database and start server
async function startServer() {
  try {
    // Synchronize Sequelize models with SQLite database
    await sequelize.sync();
    console.log('Database connected and synchronized successfully.');

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
}

startServer();
