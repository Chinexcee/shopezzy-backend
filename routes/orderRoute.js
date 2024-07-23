// routes/orderRoutes.js

const express = require('express');

const { placeOrder, updateOrderStatus, trackOrder } = require('../controls/orderController');





const router = express.Router();




router.post('/order', placeOrder);
router.put('/order_update/:orderId', updateOrderStatus);
router.get('/track_order/:orderId', trackOrder);

module.exports = router;
