const mongoose = require('mongoose');
 
 // Define the Category Schema
 const categorySchema = new mongoose.Schema({
     name: { type: String, required: true, unique: true },
     filters: [{ type: String, required: true }] // Changed to match your data
 }, { timestamps: true });
 
 // Create and export the Category model
 module.exports = mongoose.model('Category', categorySchema);