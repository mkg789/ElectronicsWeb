// src/features/wishlist/useWishlist.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchWishlist,
  removeWishlistItem,
  moveWishlistItemToCart,
} from "./api";

export default function useWishlist() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ----------------------------------------
     LOAD USER
  ---------------------------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return navigate("/login");
      setUser(JSON.parse(saved));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  /* ----------------------------------------
     LOAD WISHLIST
  ---------------------------------------- */
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetchWishlist()
      .then(setWishlist)
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Failed to load wishlist.",
          severity: "error",
        })
      )
      .finally(() => setLoading(false));
  }, [user]);

  /* ----------------------------------------
     ACTIONS
  ---------------------------------------- */
  const removeItem = async (productId) => {
    try {
      await removeWishlistItem(productId);
      setWishlist(prev =>
        prev.filter(item => item.productId._id !== productId)
      );
      setSnackbar({
        open: true,
        message: "Item removed from wishlist.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to remove item.",
        severity: "error",
      });
    }
  };

  const moveToCart = async (productId) => {
    try {
      await moveWishlistItemToCart(productId);
      setWishlist(prev =>
        prev.filter(item => item.productId._id !== productId)
      );
      setSnackbar({
        open: true,
        message: "Product moved to cart 🛒",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to move item to cart.",
        severity: "error",
      });
    }
  };

  return {
    user,
    wishlist,
    loading,

    removeItem,
    moveToCart,

    snackbar,
    closeSnackbar: () =>
      setSnackbar(prev => ({ ...prev, open: false })),
  };
}
