const mongoose = require('mongoose');
 
 const productSchema = new mongoose.Schema({
     name: { type: String, required: true },
     price: { type: Number, required: true },
     image:  [{ type: String }],
     category: { 
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Category', 
         required: true 
       },
       filters: [{ type: String }]
     });
 
 module.exports = mongoose.model('Product', productSchema);