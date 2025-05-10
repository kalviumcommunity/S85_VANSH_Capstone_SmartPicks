const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  usp: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [String],
  category: String,
  stock: {
    type: Number,
    default: 0
  },
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
