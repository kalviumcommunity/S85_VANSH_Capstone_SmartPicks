const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  website: String,
  logoUrl: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

module.exports = mongoose.model('Startup', startupSchema);
