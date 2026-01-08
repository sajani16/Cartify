const Cart = require("../models/cart");
const Product = require("../models/product");

/* ========== ADD OR UPDATE CART ITEM ========== */
async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    if (quantity > product.stock)
      return res.status(400).json({ message: "Not enough stock" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      const existing = cart.products.find(
        (p) => p.product.toString() === productId
      );
      if (existing) existing.quantity += quantity;
      else cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Cart updated", cart });
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

/* ========== GET CART ITEMS ========== */
async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product",
      "name price image"
    );
    const products = cart ? cart.products : [];
    res.json({ success: true, cart: { products } });
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

/* ========== UPDATE QUANTITY ========== */
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

    res.json({ success: true, message: "Cart updated", cart });
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

/* ========== REMOVE CART ITEM ========== */
async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.products = cart.products.filter(
      (i) => i.product.toString() !== productId
    );
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

module.exports = { addToCart, getCart, updateCart, removeFromCart };
