const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  StartupName: { type: String, required: true },
  StartupType: { type: String, required: true },
  StartupEmail: { type: String, required: true, unique: true },
  StartupPassword: { type: String, required: true },
  StartupUSP: { type: String },
  StartupOrigin: { type: String },
  StartupFounderEmail: { type: String },
  StartupLogo: { type: String },
  StartupWebsiteLink: { type: String },
  StartupInstaLink: { type: String },
  StartupId: {
  type: String,
  required: true,
  unique: true
    },
  registeredAt: {
    type: Date,
    default: Date.now,
    },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Startup' , startupSchema);