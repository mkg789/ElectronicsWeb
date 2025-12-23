// src/features/orders/api.js
import API from "../../api/api";

export const fetchOrderById = (orderId) =>
  API.get(`/orders/${orderId}`).then(res => res.data);

export const fetchOrderHistory = () =>
  API.get("/orders/history").then(res => res.data.orderHistory || []);
