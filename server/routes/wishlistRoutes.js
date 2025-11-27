// wishlist.js
import express from "express";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* -----------------------------------------
   ADD TO WISHLIST
--------------------------------------------*/
router.post("/add", auth, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicates
    const exists = user.wishlist.find(
      (item) => item.productId.toString() === productId
    );

    if (!exists) {
      user.wishlist.push({ productId });
      await user.save();
    }

    await user.populate("wishlist.productId");

    res.json({
      success: true,
      wishlist: user.wishlist
    });

  } catch (err) {
    console.error("Wishlist add error:", err);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});


/* -----------------------------------------
   GET USER WISHLIST
--------------------------------------------*/
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist.productId");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.wishlist);

  } catch (err) {
    console.error("Wishlist fetch error:", err);
    res.status(500).json({ error: "Could not fetch wishlist" });
  }
});


/* -----------------------------------------
   REMOVE FROM WISHLIST
--------------------------------------------*/
router.post("/remove", auth, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.wishlist = user.wishlist.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    await user.populate("wishlist.productId");

    res.json({
      success: true,
      wishlist: user.wishlist
    });

  } catch (err) {
    console.error("Wishlist remove error:", err);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export default router;
