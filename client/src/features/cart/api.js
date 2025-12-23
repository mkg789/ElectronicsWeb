// features/cart/api.js
import API from "../../api/api";

export const fetchCart = () => API.get("/cart");

export const addToCart = (productId) =>
  API.post("/cart/add", { productId });

export const removeOneFromCart = (productId) =>
  API.post("/cart/remove-one", { productId });

export const removeFromCart = (productId) =>
  API.post("/cart/remove", { productId });
