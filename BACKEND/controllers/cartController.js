const Cart = require("../models/cart");
const Product = require("../models/product");

// Add product to cart (or update quantity if already exists)
async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already exists in cart
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({
          product: productId,
          quantity,
        });
      }
    }

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
      "name price image"
    );

    if (!cart || cart.products.length === 0) {
      return res.json({
        success: true,
        message: "Cart is empty",
        cart: { products: [] },
      });
    }

    res.json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
}

//Update Qunatity
async function updateCart(req, res) {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price image"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const product = cart.products.find(
      (i) => i.product._id.toString() === productId
    );

    if (!product) return res.status(404).json({ message: "Item not found" });
    product.quantity = quantity;
    await cart.save();
    res.json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
}
// Remove product from cart
async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product",
      "name price image"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (i) => i.product._id.toString() !== productId
    );

    await cart.save();

    res.json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product",
      error: error.message,
    });
  }
}

module.exports = { addToCart, getCart, removeFromCart, updateCart };
