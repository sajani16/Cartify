const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

// Create a new order
async function createOrder(req, res) {
  try {
    const userId = req.user.id;

    // Fetch user's cart with product details
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price stock image"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Check stock for each product
    for (const item of cart.products) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.product.name}`,
        });
      }
    }

    // Create order using correct 'products' field
    const order = await Order.create({
      user: userId,
      products: cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount: cart.products.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
      ),
      status: "Pending",
    });

    // Reduce stock
    for (const item of cart.products) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // Clear cart
    cart.products = [];
    await cart.save();

    // Populate products before sending response
    await order.populate("products.product", "name price image");

    res
      .status(201)
      .json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
}

// Get orders for logged-in user
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product",
      "name price image"
    );

    res.json({ success: true, message: "Your orders...", orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
}

// Get all orders (admin)
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price image");

    res.json({ success: true, message: "All orders", orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
}

// Update order status
// Update order status
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // Populate product info before returning
    await order.populate("products.product", "name price image");

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update order failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
}

// Cancel order (user)
async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (!["Pending", "Processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order after it has been shipped or delivered",
      });
    }

    order.status = "Cancelled";
    await order.save();

    // Populate products before sending response
    await order.populate("products.product", "name price image");

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  cancelOrder,
  updateOrderStatus,
};
