const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

/* ========== CREATE ORDER FROM SELECTED CART ITEMS ========== */
async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, selectedProductIds } = req.body;

    // Validate shipping fields
    const requiredFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "country",
    ];
    for (let field of requiredFields) {
      if (!shippingAddress?.[field]) {
        return res
          .status(400)
          .json({ success: false, message: `${field} is required` });
      }
    }

    if (
      !selectedProductIds ||
      !Array.isArray(selectedProductIds) ||
      selectedProductIds.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "No items selected to order" });
    }

    // Fetch cart
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    // Filter selected items
    const itemsToOrder = cart.products.filter((item) =>
      selectedProductIds.includes(item.product._id.toString())
    );
    if (itemsToOrder.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Selected items not found in cart" });

    // Check stock availability
    for (const item of itemsToOrder) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.product.name}`,
        });
      }
    }

    // Calculate subtotal
    const subtotal = itemsToOrder.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0
    );

    // Prepare order products
    const orderProducts = itemsToOrder.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
      price: i.product.price,
    }));

    // Create order
    const order = await Order.create({
      user: userId,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      subtotal,
      totalAmount: subtotal,
    });

    // Reduce stock
    for (const item of itemsToOrder) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // Remove ordered items from cart
    cart.products = cart.products.filter(
      (item) => !selectedProductIds.includes(item.product._id.toString())
    );
    await cart.save();

    await order.populate("products.product", "name price image");
    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
  }
}

/* ========== GET LOGGED-IN USER ORDERS ========== */
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.product",
      "name price image"
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
  }
}

/* ========== ADMIN: GET ALL ORDERS ========== */
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price image");
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
  }
}

/* ========== ADMIN: UPDATE ORDER STATUS ========== */
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowed = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!status || !allowed.includes(status))
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });

    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();
    await order.populate("products.product", "name price image");
    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update status",
        error: error.message,
      });
  }
}

/* ========== CANCEL ORDER (USER) ========== */
async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (order.user.toString() !== req.user.id)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    if (!["Pending", "Processing"].includes(order.status))
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel shipped/delivered order",
        });

    order.status = "Cancelled";
    await order.save();
    await order.populate("products.product", "name price image");
    res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to cancel order",
        error: error.message,
      });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
