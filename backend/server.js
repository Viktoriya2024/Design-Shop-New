require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/products'); // Import Product model
const Category = require('./models/Category'); // Import Category model
const productRoutes = require('./routes/productRoutes'); // Import routes
const categoryRoutes = require('./routes/categoryRoutes');


const app = express(); // ✅ Define app first

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedDatabase(); // 🌱 Seed database
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Function to seed the database with product and category data
async function seedDatabase() {
  try {
    const productCount = await Product.countDocuments(); // Count existing products
    const categoryCount = await Category.countDocuments(); // Count existing categories

    if (productCount === 0) { // Seed only if products are empty
      await Product.insertMany(seedDB.products);  // Assuming seedDB.products contains product data
      console.log('✅ Products seeded successfully!');
    } else {
      console.log('⚠️ Database already contains products. Skipping seeding.');
    }

    if (categoryCount === 0) { // Seed only if categories are empty
      const categories = ['Mirrors', 'Plants and Flowers', 'Decorative Accessories', 'Window Treatments', 'Art', 'Throw Pillows'];

      // Insert categories into the database
      await Category.insertMany(categories.map(name => ({ name })));
      console.log('✅ Categories seeded successfully!');
    } else {
      console.log('⚠️ Database already contains categories. Skipping seeding.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}
