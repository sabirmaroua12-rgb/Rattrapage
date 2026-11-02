// middleware/authMiddleware.js
// Middleware to verify JSON Web Token (JWT) in incoming requests

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. Read the Authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if header is missing
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 2. Extract Bearer token from "Bearer <token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  // 3. Verify the token using the secret key
  const secretKey = process.env.JWT_SECRET || 'my_simple_secret_key_12345';

  jwt.verify(token, secretKey, (err, decoded) => {
    // 4. If token is invalid or expired, return HTTP 401
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // 5. If valid, attach decoded user information to request and proceed
    req.user = decoded;
    next();
  });
}

module.exports = authMiddleware;
