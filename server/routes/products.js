import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// -------------------------------------------
// GET all products
// -------------------------------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------
// 🔥 SEARCH products (must be BEFORE :id)
// -------------------------------------------
router.get("/search", async (req, res) => {
  try {
    let q = req.query.q || "";
    q = q.trim();

    if (!q) return res.json([]);

    const escapeRegex = (text) =>
      text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(escapeRegex(q), "i");

    const products = await Product.find({ name: { $regex: regex } });
    res.json(products);
  } catch (err) {
    console.error("Search route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------
// 🔥 GET all unique categories
// -------------------------------------------
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// -------------------------------------------
// 🔥 GET products by category
// -------------------------------------------
router.get("/category/:cat", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.cat });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch category products" });
  }
});

// -------------------------------------------
// GET product by ID (must be LAST)
// -------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
