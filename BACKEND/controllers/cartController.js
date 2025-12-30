const Cart = require("../models/cart");
const Product = require("../models/product");

// Add product to cart (or update quantity if already exists)
async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity, price: product.price }],
      });
    } else {
      // Check if product already exists in cart
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === productId
      );

      if (existingProduct) {
        // Update quantity
        existingProduct.quantity = quantity; // replace or += depending on logic
      } else {
        cart.products.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }
    }

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update cart",
        error: error.message,
      });
  }
}

// Get user's cart
async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product",
      "name price"
    );

    if (!cart || cart.products.length === 0) {
      return res.json({ success: true, message: "Cart is empty", cart: null });
    }

    res.json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch cart",
        error: error.message,
      });
  }
}

// Remove product from cart
async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const index = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not in cart" });
    }

    cart.products.splice(index, 1);
    await cart.save();

    res.json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to remove product",
        error: error.message,
      });
  }
}

module.exports = { addToCart, getCart, removeFromCart };
