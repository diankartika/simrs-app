const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock users - replace dengan database
const users = [
  { id: 1, username: 'admin', password: '$2a$10$YourHashedPasswordHere', role: 'admin' },
  { id: 2, username: 'doctor', password: '$2a$10$YourHashedPasswordHere', role: 'doctor' },
  { id: 3, username: 'medical_coder', password: '$2a$10$YourHashedPasswordHere', role: 'medical_coder' }
];

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // In production, use bcrypt.compare
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ 
    token, 
    user: { id: user.id, username: user.username, role: user.role } 
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Export
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
