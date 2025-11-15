import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ------------------ SIGNUP ------------------ */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already registered" });

    const hashedPass = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPass,
    });

    await user.save();

    return res.json({ msg: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
});

/* ------------------ LOGIN ------------------ */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ msg: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
