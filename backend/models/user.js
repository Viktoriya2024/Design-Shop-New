const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String, // You should hash the password before saving
});

module.exports = mongoose.model('User', userSchema);
