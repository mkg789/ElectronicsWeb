import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================
// GET /api/user/checkout-info
// ============================
router.get("/checkout-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      shipping: user.shippingInfo || null,
      billing: user.billingInfo || null,
    });
  } catch (err) {
    console.error("Checkout info fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// POST /api/user/saveCheckoutInfo
// ============================
router.post("/saveCheckoutInfo", authMiddleware, async (req, res) => {
  try {
    const { shipping, billing } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.shippingInfo = shipping;
    user.billingInfo = billing;

    await user.save();

    res.json({
      message: "Checkout info saved successfully",
      shipping,
      billing
    });
  } catch (err) {
    console.error("Save checkout info error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
