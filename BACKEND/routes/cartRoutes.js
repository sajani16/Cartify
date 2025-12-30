const express = require("express");
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add or update product in cart
router.post("/add", protect, addToCart);

// Get current user's cart
router.get("/", protect, getCart);

// Remove product from cart
router.delete("/remove/:productId", protect, removeFromCart);

module.exports = router;
