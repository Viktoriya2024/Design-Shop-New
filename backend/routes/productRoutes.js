const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/Category");
const upload = require("../utils/upload");

const router = express.Router();

/**
 * 🛒 GET All Products (Filter by Category & Subcategory)
 * Endpoint: GET /api/products
 */
router.get("/", async (req, res) => {
  try {
    const { category, filters } = req.query;
    let query = {};

    console.log("Received Query Params:", { category, filters });

    // Filter by category if provided
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    // Filter by subcategory (filters)
     if (filters) {
      console.log("Filters received:", filters); // Add this log to check the value of filters
      if (typeof filters === "string") {
        const filterArray = filters.split(",").map((filter) => filter.trim()); // Remove spaces
        if (filterArray.length > 0) {
          query.subcategory = { $in: filterArray };
        }
      }
    } else {
      console.log("Filters are undefined or empty."); // Log this if filters are not present
    }

    console.log("Final Query to MongoDB:", query);

    const products = await Product.find(query).populate("category"); // Populating category to get full category details
    console.log("Products Found:", products.length);

    res.json(products);
  } catch (error) {
    console.error("Error Fetching Products:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
/**
 * 🛒 GET Single Product by ID
 * Endpoint: GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id).populate("category"); // Populating category
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

/**
 * 🛍️ POST Create a New Product
 * Endpoint: POST /api/products
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Price must be a valid number greater than zero" });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const categoryExists = await Category.exists({ _id: category });
    if (!categoryExists) {
      return res.status(400).json({ error: "Category not found" });
    }

    const imageUrl = req.file ? req.file.path : "";

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subcategory,
      image: imageUrl,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ error: "Error inserting product", message: error.message });
  }
});

/**
 * 🛒 GET Category by Name
 * Endpoint: GET /api/categories
 */
router.get("/categories", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findOne({ name: new RegExp(name, "i") });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ categoryId: category._id, categoryName: category.name });
  } catch (error) {
    console.error("Error fetching category by name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
