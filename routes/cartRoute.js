const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controls/cartController');





const router = express.Router();





router.post('/post_cart', addToCart);
router.get('/fetch_cart/:userId', getCart);
router.delete('/del_cart/:userId/:productId', removeFromCart);

module.exports = router;
