const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

// User
router.post("/createorder", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.delete("/cancelorder/:orderId", protect, cancelOrder);

// Admin
router.get("/allorders", protect, admin, getAllOrders);
router.put("/updateorder/:orderId", protect, admin, updateOrderStatus);

module.exports = router;
