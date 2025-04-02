const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/products");
const Category = require("../models/Category");
const upload = require("../utils/upload");

const router = express.Router();

const fetchAllProducts = async () => {
  return await Product.find({});
};
// Function to fetch products based on category and filters
const fetchProducts = async (categoryName, filters) => {
  try {
      let query = {}; // Default: No filters applied (fetch all)

      if (categoryName) {
        console.log(`🔍 Searching for category: ${categoryName}`); // Debugging log
          // Find the category by name
          const category = await Category.findOne({ name: categoryName });

          if (!category) {
            console.log(`❌ Category "${categoryName}" not found in the database.`);
            return [];
          }
          console.log(`✅ Category found: ${category.name} (ID: ${category._id})`);
          // Add category filter (only products from this category)
          query.category = category._id;
      }

      if (filters && filters.length > 0) {
          // Apply filters (only if filters are provided)
          query.filters = { $in: filters };
      }
      console.log(`📢 Final Query to MongoDB:`, query);
      // Fetch products based on query
      const products = await Product.find(query)
          .populate('category', 'name') // Populate category name
          .limit(10) // Limit results to 10
          .exec();
          console.log(`✅ Found ${products.length} products.`);
      return products;
  } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
  }
};
/**
 * 🛒 GET All Products (Filter by Category & Subcategory)
 * Endpoint: GET /api/products
 */
router.get("/", async (req, res) => {
  try {
    const { category, filters } = req.query;
    console.log("Received Query Params:", { category, filters });

    const filtersArray = filters ? filters.split(',') : [];

    let products;
    if (category) {
      // Fetch products filtered by category
      products = await fetchProducts(category, filtersArray);
    } else {
      // Fetch all products when no category is provided
      products = await fetchAllProducts();
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

   
/**
 * 🛒 GET Single Product by ID
 * Endpoint: GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { category, filters } = req.query;
    const filtersArray = filters ? filters.split(',') : [];

    // Fetch products
    const products = await fetchProducts(category, filtersArray);

    if (!products.length) {
        return res.status(404).json({ message: 'No products found for this category.' });
    }

    res.json(products);
} catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
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




module.exports = router;
