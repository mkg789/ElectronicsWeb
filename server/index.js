import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";

dotenv.config();
const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* CONNECT DB */
connectDB();

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/* START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
