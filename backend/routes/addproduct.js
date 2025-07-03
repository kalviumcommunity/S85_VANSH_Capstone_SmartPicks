const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema'); // your product schema
const verifyToken = require('../middleware/verifyToken');

// POST /addproduct
router.post('/addproduct', verifyToken, async (req, res) => {
  try {
    const {
      productName,
      productCategory,
      stocks,
      color,
      usp,
      description,
      productImage
    } = req.body;

    // Extracted from JWT payload via middleware
    const startupId = req.startup.StartupId;

    // Validate
    if (!productName || !productCategory || !stocks || !productImage) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    const newProduct = new Product({
      productName,
      productCategory,
      stocks,
      color,
      usp,
      description,
      productImage,
      startupId
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully!",
      product: newProduct
    });

  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ error: "Server error while adding product." });
  }
});

// GET /bystartup/:startupId - fetch all products for a startup
router.get('/bystartup/:startupId', verifyToken, async (req, res) => {
  try {
    const { startupId } = req.params;
    const products = await Product.find({ startupId });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// DELETE /delete/:productId - delete a product by its ID
router.delete('/delete/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;
