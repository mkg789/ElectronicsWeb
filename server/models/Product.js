import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  imageUrl: String,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema, "products"); 
// "products" = your MongoDB collection in "test" database

export default Product;
