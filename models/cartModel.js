const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', // the product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // the user model
    required: true,
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
