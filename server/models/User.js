import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  fullName: { type: String },
  phone: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  country: { type: String },
});

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: { type: Number, default: 1 },
  price: { type: Number }, // snapshot of price at order time
});

const OrderHistorySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  cart: [OrderItemSchema],
  shippingInfo: AddressSchema,
  billingInfo: AddressSchema,
  paymentMethod: { type: String },
  paymentStatus: { type: String },
  transactionId: { type: String },
  totalAmount: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1 },
      },
    ],

    wishlist: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],

    shippingInfo: AddressSchema,
    billingInfo: AddressSchema,

    // NEW: Order history
    orderHistory: [OrderHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);