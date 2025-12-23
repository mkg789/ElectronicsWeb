// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// ⭐ IMPORTANT: Define /history BEFORE /:orderId
// Otherwise, /history will be treated as an orderId parameter

// GET /api/orders/history (Retrieve user's order history)
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("orderHistory.orderId");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ orderHistory: user.orderHistory });
  } catch (err) {
    console.error("Order history fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch order history" });
  }
});

// GET /api/orders/:orderId (Get specific order details)
router.get("/:orderId", authMiddleware, async (req, res) => {
  const { orderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ msg: "Invalid order id" });
  }

  try {
    const order = await Order.findById(orderId)
      .populate("cart.productId")
      .populate("userId", "name email");

    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Verify order belongs to user
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    res.json({ order });
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch order" });
  }
});

// POST /api/orders/create-dummy (Create new order)
router.post("/create-dummy", authMiddleware, async (req, res) => {
  try {
    const {
      cart: clientCart,
      shipping,
      billing,
      paymentMethod,
      paymentStatus,
      transactionId,
      total,
    } = req.body;

    // 1. Fetch product details to store name and price snapshot
    const cart = await Promise.all(
      clientCart.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    // 2. Create order in Order collection
    const newOrder = new Order({
      userId: req.userId,
      cart,
      shippingInfo: shipping,
      billingInfo: billing,
      paymentMethod,
      paymentStatus,
      transactionId,
      totalAmount: total,
    });

    await newOrder.save();

    // 3. Add order to user's orderHistory
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.orderHistory.push({
      orderId: newOrder._id,
      cart,
      shippingInfo: shipping,
      billingInfo: billing,
      paymentMethod,
      paymentStatus,
      transactionId,
      totalAmount: total,
      createdAt: new Date(),
    });

    // 4. Clear user's cart after successful order
    user.cart = [];
    await user.save();

    res.json({ order: newOrder });
  } catch (err) {
    console.error("Dummy order error:", err);
    res.status(500).json({ msg: "Failed to create order" });
  }
});

export default router;
