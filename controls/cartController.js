const Cart = require('../models/cartModel');
const product = require('../models/productModel');

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    // If cart does not exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Find the product to get the price
    const product = await Ad.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the item is already in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex >= 0) {
      // Update the quantity of the existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add the new item to the cart
      cart.items.push({ productId, quantity });
    }

    // Update the total price
    cart.totalPrice += product.price * quantity;
    cart.dateUpdated = Date.now();

    await cart.save();

    res.status(200).json({message: "Saved to cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId', 'title price');

    if (!cart) {
      return res.status(404).json({message: 'Cart not found'});
    }

    res.status(200).json({message: "Your cart list", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({message: 'Cart not found' });
    }

    // Find the index of the item to be removed
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not fo in the cart' });
    }

    // Get the price of the product
    const product = await product.findById(productId);

    // Update the total price
    cart.totalPrice -= product.price * cart.items[itemIndex].quantity;

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);
    cart.dateUpdated = Date.now();

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
