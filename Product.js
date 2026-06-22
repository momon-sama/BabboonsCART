const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: { type: String, default: 'general' },
    stock: { type: Number, default: 100, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
