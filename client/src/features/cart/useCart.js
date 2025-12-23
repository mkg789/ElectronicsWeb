// features/cart/useCart.js
import { useState, useEffect, useCallback } from "react";
import {
  fetchCart,
  addToCart,
  removeOneFromCart,
  removeFromCart,
} from "./api";

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState({});

  /* ---------------- LOAD CART ---------------- */
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCart();
      setCart(res.data || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* ---------------- LOCAL FALLBACK ---------------- */
  const updateLocalCart = (productId, qtyChange) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: item.quantity + qtyChange }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* ---------------- UNIFIED HANDLER ---------------- */
  const handleAction = async (productId, apiCall, qtyChange = 0) => {
    setIsUpdating((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await apiCall();

      if (res?.data?.cart) {
        setCart(res.data.cart);
      } else {
        qtyChange !== 0
          ? updateLocalCart(productId, qtyChange)
          : setCart((prev) =>
              prev.filter((i) => i.productId._id !== productId)
            );
      }
    } catch (err) {
      console.error("Cart action failed:", err);
    } finally {
      setIsUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const increaseQty = (productId) =>
    handleAction(productId, () => addToCart(productId), 1);

  const decreaseQty = (productId) =>
    handleAction(productId, () => removeOneFromCart(productId), -1);

  const removeItem = (productId) =>
    handleAction(productId, () => removeFromCart(productId));

  /* ---------------- TOTAL ---------------- */
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
    removeItem,
    loadCart,
  };
};

export default useCart;
