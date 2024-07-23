
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', 
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  trackingNumber: {
    type: String,
    required: false,
  },
  datePlaced: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
