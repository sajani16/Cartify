const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

router.get("/allorders", protect, admin, getAllOrders);

router.put("/status/:orderId", protect, admin, updateOrderStatus);

// USER cancels order (status update, not delete)
router.put("/cancel/:orderId", protect, cancelOrder);

module.exports = router;
