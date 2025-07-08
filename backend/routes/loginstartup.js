const express = require('express');
const router = express.Router();
const startup = require('../models/startupSchema');
const bcrypt = require('bcryptjs');
const generateToken = require('../middleware/generateToken');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const verifyToken = require('../middleware/verifyToken');

router.post('/login', async (req, res) => {
  const { StartupEmail, StartupPassword } = req.body;
  if (!StartupEmail || !StartupPassword) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const foundStartup = await startup.findOne({ StartupEmail });
  if (!foundStartup) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(StartupPassword, foundStartup.StartupPassword);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = generateToken({
    StartupId: foundStartup.StartupId,
    StartupEmail: foundStartup.StartupEmail,
  });

  res.json({
    message: 'Login successful!',
    token,
    startup: {
      StartupId: foundStartup.StartupId,
      StartupName: foundStartup.StartupName,
      StartupEmail: foundStartup.StartupEmail,
      StartupType: foundStartup.StartupType,
      StartupLogo: foundStartup.StartupLogo,
      StartupUSP: foundStartup.StartupUSP,
      StartupOrigin: foundStartup.StartupOrigin,
      StartupFounderEmail: foundStartup.StartupFounderEmail,
      StartupWebsiteLink: foundStartup.StartupWebsiteLink,
      StartupInstaLink: foundStartup.StartupInstaLink,
    }
  });
});

// Google Login Route
router.post('/google-login', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required.' });
  }
  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // Extract info
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    // Try to find existing startup by email
    let foundStartup = await startup.findOne({ StartupEmail: email });
    if (!foundStartup) {
      // Create a new startup with Google info (minimal fields)
      const StartupId = 'SID' + Math.floor(100000 + Math.random() * 900000);
      foundStartup = await startup.create({
        StartupName: name,
        StartupEmail: email,
        StartupLogo: picture,
        StartupType: 'Google',
        StartupPassword: 'GOOGLE_AUTH', // Not used
        StartupId,
      });
    }
    // Issue JWT
    const token = generateToken({
      StartupId: foundStartup.StartupId,
      StartupEmail: foundStartup.StartupEmail,
    });
    res.json({
      message: 'Google login successful!',
      token,
      startup: {
        StartupId: foundStartup.StartupId,
        StartupName: foundStartup.StartupName,
        StartupEmail: foundStartup.StartupEmail,
        StartupType: foundStartup.StartupType,
        StartupLogo: foundStartup.StartupLogo,
        StartupUSP: foundStartup.StartupUSP,
        StartupOrigin: foundStartup.StartupOrigin,
        StartupFounderEmail: foundStartup.StartupFounderEmail,
        StartupWebsiteLink: foundStartup.StartupWebsiteLink,
        StartupInstaLink: foundStartup.StartupInstaLink,
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ error: 'Invalid Google token.' });
  }
});

// Logout Route
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // In a more complex system, you might want to:
    // 1. Add the token to a blacklist
    // 2. Update user's last logout time
    // 3. Log the logout event
    
    res.json({ 
      message: 'Logout successful',
      success: true 
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router; 