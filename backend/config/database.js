// config/database.js
// Configure SQLite database connection using Sequelize ORM

const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize instance with SQLite dialect
const sequelize = new Sequelize({
  dialect: 'sqlite',
  // Store the database file in the root of the backend folder
  storage: path.join(__dirname, '..', 'database.sqlite'),
  // Set logging to false to keep terminal output clean and readable
  logging: false,
});

module.exports = sequelize;
