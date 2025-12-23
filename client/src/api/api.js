import axios from "axios";

const API = axios.create({
  // Use Vite environment variable when provided (VITE_API_URL), otherwise fallback to hosted backend
  baseURL: import.meta.env.VITE_API_URL || "https://electronicsweb.onrender.com/api",
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;