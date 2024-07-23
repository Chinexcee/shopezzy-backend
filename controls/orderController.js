// controllers/orderController.js

const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const product = require('../models/productModel');

exports.placeOrder = async (req, res) => {
  const { userId, items, totalPrice } = req.body;

  try {
    // Validate required fields
    if (!userId || !items || items.length === 0 || !totalPrice) {
      return res.status(400).json({message: 'Fill all fields' });
    }

    const order = new Order({
      userId,
      items,
      totalPrice,
    });

    await order.save();

    // Clear the user's cart after placing an order
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, trackingNumber } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.dateUpdated = Date.now();

    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.trackOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('items.productId', 'title price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
