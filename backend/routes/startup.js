const express = require('express');
const router = express.Router();
const startup = require('../models/startupSchema');
const generateToken = require('../middleware/generateToken');

router.post('/register', async (req, res) => {
  try {
    const {
      StartupName,
      StartupType,
      StartupEmail,
      StartupPassword,
      StartupLogo,
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

    const newStartup = await startup.create({ ...req.body, StartupId });

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
      }
    });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
