const express = require("express");
const Category = require("../models/Category");

const router = express.Router();

/**
 * 🎯 GET All Categories
 * Endpoint: GET /api/categories
 */
const fetchProducts = async (req, res) => {
    try {
      const { category, filters } = req.query;
      console.log("Received Query Params:", req.query);
  
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }
  
      // Step 1: Find Category ObjectId
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      console.log(`✅ Category found: ${categoryDoc.name} (ID: ${categoryDoc._id})`);
  
      // Step 2: Build MongoDB query
      let query = { category: categoryDoc._id };
  
      if (filters) {
        query.filters = { $in: filters.split(",") };
      }
  
      console.log(`📢 Final Query to MongoDB:`, query);
  
      // Step 3: Fetch products
      const products = await Product.find(query);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * 🎯 GET a Single Category by Name
 * Endpoint: GET /api/categories?name=CategoryName
 */
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findOne({ name: new RegExp(name, "i") });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category by name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

