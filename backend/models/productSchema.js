// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCategory: { type: String, required: true },
  stocks: { type: Number, required: true },
  color: { type: String },
  usp: { type: String },
  description: { type: String },
  productImage: { type: String, required: true },
  startupId: { type: String, required: true }, // From JWT
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
