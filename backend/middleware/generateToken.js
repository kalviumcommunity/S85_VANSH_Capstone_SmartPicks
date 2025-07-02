// middleware/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

module.exports = generateToken;
