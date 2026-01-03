// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");

router.get("/getcart", protect, getCart);
router.post("/addtocart", protect, addToCart);
router.put("/updatecart/:productId", protect, updateCart);
router.delete("/removefromcart/:productId", protect, removeFromCart);

module.exports = router;
