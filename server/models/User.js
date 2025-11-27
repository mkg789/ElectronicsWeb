import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],

  wishlist: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    }
  ]
});

export default mongoose.model("User", UserSchema);
