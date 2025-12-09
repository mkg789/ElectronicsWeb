import express from "express";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* -----------------------------------------
   ADD TO CART
--------------------------------------------*/
router.post("/add", auth, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const existing = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existing) existing.quantity += 1;
    else user.cart.push({ productId, quantity: 1 });

    await user.save();
    await user.populate("cart.productId");

    res.json({ success: true, cart: user.cart });

  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

/* -----------------------------------------
   GET USER CART
--------------------------------------------*/
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.productId");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.cart);

  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

/* -----------------------------------------
   REMOVE ONE ITEM (decrease quantity by 1)
--------------------------------------------*/
router.post("/remove-one", auth, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const item = user.cart.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not in cart" });

    item.quantity -= 1;
    if (item.quantity <= 0) {
      user.cart = user.cart.filter((i) => i.productId.toString() !== productId);
    }

    await user.save();
    await user.populate("cart.productId");

    res.json({ success: true, cart: user.cart });

  } catch (err) {
    console.error("Remove one error:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

/* -----------------------------------------
   REMOVE ITEM COMPLETELY
--------------------------------------------*/
router.post("/remove", auth, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cart = user.cart.filter((i) => i.productId.toString() !== productId);

    await user.save();
    await user.populate("cart.productId");

    res.json({ success: true, cart: user.cart });

  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

/* -----------------------------------------
   CLEAR CART (After successful order)
--------------------------------------------*/
router.post("/clear", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cart = []; // remove all cart items
    await user.save();

    res.json({ success: true, message: "Cart cleared successfully" });

  } catch (err) {
    console.error("Cart clear error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});


export default router;
