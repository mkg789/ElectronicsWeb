import { useState, useEffect, useCallback } from "react";
import API from "../api/api";

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState({}); // track per-product actions

  /* -------------------------------
     FETCH CART ON MOUNT
  --------------------------------*/
  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/cart");
      setCart(res.data); // server returns cart array
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* -------------------------------
     LOCAL UPDATE (fallback only)
  --------------------------------*/
  const updateLocalCart = (productId, qtyChange) => {
    setCart(prev =>
      prev
        .map(item =>
          item.productId._id === productId
            ? { ...item, quantity: item.quantity + qtyChange }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  /* -------------------------------
     UNIFIED ACTION HANDLER
     - Calls API
     - Uses server cart if returned
     - Fallback to local update
  --------------------------------*/
  const handleAction = async (productId, apiCall, qtyChange = 0) => {
    setIsUpdating(prev => ({ ...prev, [productId]: true }));

    try {
      const res = await apiCall();

      // Server always returns updated cart → use it
      if (res && res.data && res.data.cart) {
        setCart(res.data.cart);
      } else {
        // fallback (local)
        if (qtyChange !== 0) {
          updateLocalCart(productId, qtyChange);
        } else {
          setCart(prev =>
            prev.filter(item => item.productId._id !== productId)
          );
        }
      }
    } catch (err) {
      console.error("Cart action failed:", err);
    } finally {
      setIsUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  /* -------------------------------
     ACTIONS (public API)
  --------------------------------*/
  const increaseQty = productId =>
    handleAction(productId, () => API.post("/cart/add", { productId }), 1);

  const decreaseQty = productId =>
    handleAction(productId, () =>
      API.post("/cart/remove-one", { productId }),
      -1
    );

  const removeItem = productId =>
    handleAction(productId, () => API.post("/cart/remove", { productId }));

  /* -------------------------------
     TOTAL PRICE
  --------------------------------*/
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
  };
};

export default useCart;
