// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token or wrong format in Authorization header:", authHeader);
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || 'pookie_vansh';

  try {
    const decoded = jwt.verify(token, secret);
    req.startup = decoded; // attach decoded info to req
    console.log("✅ JWT Verified - Decoded payload:", decoded);
    console.log("📥 Authorization header received:", authHeader);
    next();
  } catch (err) {
    console.log("❌ JWT Verification Failed");
    console.log("📥 Authorization header received:", authHeader);
    console.log("🔍 Error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
