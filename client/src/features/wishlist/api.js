// src/features/wishlist/api.js
import API from "../../api/api";

export const fetchWishlist = () =>
  API.get("/wishlist").then(res => res.data);

export const removeWishlistItem = (productId) =>
  API.post("/wishlist/remove", { productId });

export const addWishlistItem = (productId) =>
  API.post("/wishlist/add", { productId });

export const moveWishlistItemToCart = async (productId) => {
  await API.post("/cart/add", { productId });
  await API.post("/wishlist/remove", { productId });
};
