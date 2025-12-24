// src/features/wishlist/useWishlist.js
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchWishlist,
  removeWishlistItem,
  moveWishlistItemToCart,
} from "./api";

/* ---------------- Hook ---------------- */

export default function useWishlist() {
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ---------------- Helpers ---------------- */

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /* ---------------- Lifecycle ---------------- */

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ---------------- Load User ---------------- */

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) {
        navigate("/login");
        return;
      }
      setUser(JSON.parse(saved));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  /* ---------------- Load Wishlist ---------------- */

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWishlist();
      if (mountedRef.current) setWishlist(data);
    } catch {
      showSnackbar("Failed to load wishlist.", "error");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    if (user) loadWishlist();
  }, [user, loadWishlist]);

  /* ---------------- Actions ---------------- */

  const removeItem = useCallback(async (productId) => {
    try {
      await removeWishlistItem(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.productId._id !== productId)
      );
      showSnackbar("Item removed from wishlist.");
    } catch {
      showSnackbar("Failed to remove item.", "error");
    }
  }, [showSnackbar]);

  const moveToCart = useCallback(async (productId) => {
    try {
      await moveWishlistItemToCart(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.productId._id !== productId)
      );
      showSnackbar("Product moved to cart 🛒");
    } catch {
      showSnackbar("Failed to move item to cart.", "error");
    }
  }, [showSnackbar]);

  /* ---------------- Public API ---------------- */

  return {
    user,
    wishlist,
    loading,

    removeItem,
    moveToCart,
    refetch: loadWishlist,

    snackbar,
    closeSnackbar: () =>
      setSnackbar((prev) => ({ ...prev, open: false })),
  };
}
