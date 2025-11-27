// hooks/useCart.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Assuming your API instance

const useCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState({}); // To track per-item loading

  // Centralized function to fetch the cart data
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/cart");
      setCart(res.data);
      return res.data; // Return data for potential chaining
    } catch (err) {
      console.error("Failed to load cart:", err);
      // Centralized error handling/redirect for cart loading
      // navigate("/login"); 
      setCart([]); // Set to empty on error/unauthorized
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Helper function to update cart state after an action
  const updateCartState = async (action) => {
    try {
      const res = await action();
      setCart(res.data);
    } catch (err) {
      console.error("Cart update error:", err);
      // Optionally show a toast notification here
    }
  };

  const handleAction = async (productId, apiCall) => {
    // Set item-specific loading state
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await apiCall();
      // Refetch the cart after successful action
      await fetchCart(); 
    } finally {
      // Clear item-specific loading state
      setIsUpdating(prev => ({ ...prev, [productId]: false }));
    }
  }

  const increaseQty = (productId) => 
    handleAction(productId, () => API.post("/cart/add", { productId }));

  const decreaseQty = (productId) =>
    handleAction(productId, () => API.post("/cart/remove-one", { productId }));

  const removeItem = (productId) =>
    handleAction(productId, () => API.post("/cart/remove", { productId }));

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return { 
    cart, 
    isLoading, 
    isUpdating,
    totalPrice, 
    increaseQty, 
    decreaseQty, 
    removeItem 
  };
};

export default useCart;