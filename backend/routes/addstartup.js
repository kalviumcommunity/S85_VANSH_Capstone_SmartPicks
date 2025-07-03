const express = require('express');
const router = express.Router();
const startup = require('../models/startupSchema');
const generateToken = require('../middleware/generateToken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const {
      StartupName,
      StartupType,
      StartupEmail,
      StartupPassword,
      StartupLogo,
      StartupUSP,
      StartupOrigin,
      StartupFounderEmail,
      StartupWebsiteLink,
      StartupInstaLink
    } = req.body;

    if (!StartupName || !StartupType || !StartupEmail || !StartupPassword || !StartupLogo) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const existing = await startup.findOne({ 
      $or: [ { StartupEmail }, { StartupName } ] 
    });

    if (existing) {
      return res.status(409).json({ error: 'Startup name or email already exists.' });
    }

    const StartupId = 'SID' + Math.floor(100000 + Math.random() * 900000);

    // Hash the password
    const hashedPassword = await bcrypt.hash(StartupPassword, 10);

    const newStartup = await startup.create({ 
      StartupName,
      StartupType,
      StartupEmail,
      StartupPassword: hashedPassword,
      StartupLogo,
      StartupUSP,
      StartupOrigin,
      StartupFounderEmail,
      StartupWebsiteLink,
      StartupInstaLink,
      StartupId
    });

    const token = generateToken({ 
      StartupId: newStartup.StartupId, 
      StartupEmail: newStartup.StartupEmail 
    });

    res.status(201).json({
      message: 'Registered and signed in successfully!',
      token,
      startup: {
        StartupId: newStartup.StartupId,
        StartupName: newStartup.StartupName,
        StartupEmail: newStartup.StartupEmail,
        StartupType: newStartup.StartupType,
        StartupLogo: newStartup.StartupLogo,
        StartupUSP: newStartup.StartupUSP,
        StartupOrigin: newStartup.StartupOrigin,
        StartupFounderEmail: newStartup.StartupFounderEmail,
        StartupWebsiteLink: newStartup.StartupWebsiteLink,
        StartupInstaLink: newStartup.StartupInstaLink
      }
    });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /profile/:startupId - fetch startup details except password
router.get('/profile/:startupId', async (req, res) => {
  try {
    const { startupId } = req.params;
    const startupDoc = await startup.findOne({ StartupId: startupId }).select('-StartupPassword -__v');
    if (!startupDoc) {
      return res.status(404).json({ error: 'Startup not found.' });
    }
    res.json({ startup: startupDoc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch startup details.' });
  }
});

module.exports = router;
