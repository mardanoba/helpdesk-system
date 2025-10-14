// backend/middleware/authMiddleware.js

require('dotenv').config();
const jwt = require('jsonwebtoken');

// Middleware: Check for valid token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = payload;
    next();
  });
};

// Middleware: Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
};
