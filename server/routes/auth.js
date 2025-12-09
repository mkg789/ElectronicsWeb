// routes/user.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ---------------------------------------------
   SIGNUP
---------------------------------------------- */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.json({ msg: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* ---------------------------------------------
   LOGIN
---------------------------------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },      // payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" }    // long session
    );

    // Return token + user info
    return res.json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        shippingInfo: user.shippingInfo || {},
        billingInfo: user.billingInfo || {},
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* ---------------------------------------------
   UPDATE CHECKOUT INFO
---------------------------------------------- */
router.put("/:id/checkout-info", async (req, res) => {
  const { id } = req.params;
  const { shippingInfo, billingInfo } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.shippingInfo = shippingInfo;
    user.billingInfo = billingInfo;

    await user.save();
    return res.json({ msg: "Checkout info updated", shippingInfo, billingInfo });
  } catch (err) {
    console.error("Checkout info update error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
