// models/Cart.js
const mongoose = require('mongoose');
const productModel = require('./product.model'); // Assuming you have a product model

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);


