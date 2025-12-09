import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Store a snapshot of product info at the time of order
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    shippingInfo: {
      fullName: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    billingInfo: {
      fullName: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    paymentMethod: {
      type: String,
      enum: ["dummy", "card", "upi", "netbanking", "cod", "razorpay"],
      default: "dummy",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: null,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
