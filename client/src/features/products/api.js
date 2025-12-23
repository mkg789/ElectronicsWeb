// features/products/api.js
import API from "../../api/api";

export const fetchProducts = () =>
  API.get("/products").then(res => res.data);

export const fetchProductById = (id) =>
  API.get(`/products/${id}`).then(res => res.data);

export const fetchProductsByCategory = (category) =>
  API.get(`/products/category/${category}`).then(res => res.data);

export const searchProducts = (query) =>
  API.get(`/products/search?q=${query}`).then(res => res.data);

export const getProductById = (id) =>
  API.get(`/products/${id}`).then(res => res.data);

export const getProductsByCategory = (category) =>
  API.get(`/products/category/${category}`).then(res => res.data);