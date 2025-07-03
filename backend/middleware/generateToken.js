// middleware/generateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // ✅ Correct usage

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'pookie_vansh';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

module.exports = generateToken;
