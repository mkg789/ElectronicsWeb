import { useEffect, useState, useCallback } from "react";
import API from "../../api/api";
import { fetchProducts } from "../products/api";
import { fetchCart, addToCart as apiAddToCart, removeOneFromCart } from "../cart/api";
import { fetchWishlist, removeWishlistItem, addWishlistItem } from "../wishlist/api";

export default function useECommerceData(user, navigate) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const prods = await fetchProducts();
      setProducts(prods || []);
      const cats = Array.from(new Set((prods || []).map(p => p.category).filter(Boolean)));
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load products:", err);
      setSnackbar({ open: true, message: "Failed to load products.", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCart = useCallback(async () => {
    if (!user) return setCart([]);
    try {
      const res = await fetchCart();
      // res may be array or axios response; if axios response returned object, use res.data
      const data = Array.isArray(res) ? res : res?.data || res;
      setCart(data || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setSnackbar({ open: true, message: "Failed to load cart.", severity: "error" });
    }
  }, [user]);

  const loadWishlist = useCallback(async () => {
    if (!user) return setWishlist([]);
    try {
      const res = await fetchWishlist();
      const data = Array.isArray(res) ? res : res?.data || res;
      setWishlist(data || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setSnackbar({ open: true, message: "Failed to load wishlist.", severity: "error" });
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCart();
    loadWishlist();
  }, [user, loadCart, loadWishlist]);

  /* ---------------- Actions ---------------- */
  const addToCart = async (productId) => {
    if (!user) return navigate('/login');
    try {
      await apiAddToCart(productId);
      await loadCart();
      setSnackbar({ open: true, message: "Added to cart", severity: "success" });
    } catch (err) {
      console.error("Add to cart failed:", err);
      setSnackbar({ open: true, message: "Failed to add to cart", severity: "error" });
    }
  };

  const updateCartQuantity = async (productId, action) => {
    if (!user) return navigate('/login');
    try {
      if (action === "add") {
        await apiAddToCart(productId);
      } else if (action === "remove") {
        await removeOneFromCart(productId);
      }
      await loadCart();
    } catch (err) {
      console.error("Update cart qty failed:", err);
      setSnackbar({ open: true, message: "Failed to update cart", severity: "error" });
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) return navigate('/login');
    try {
      const exists = wishlist.some((w) => w.productId && w.productId._id === product._id);
      if (exists) {
        await removeWishlistItem(product._id);
        setWishlist((prev) => prev.filter((i) => i.productId._id !== product._id));
        setSnackbar({ open: true, message: "Removed from wishlist", severity: "info" });
      } else {
        await addWishlistItem(product._id);
        await loadWishlist();
        setSnackbar({ open: true, message: "Added to wishlist", severity: "success" });
      }
    } catch (err) {
      console.error("Toggle wishlist failed:", err);
      setSnackbar({ open: true, message: "Failed to update wishlist", severity: "error" });
    }
  };

  return {
    products,
    categories,
    cart,
    wishlist,
    loading,
    snackbar,
    setSnackbar,

    addToCart,
    updateCartQuantity,
    toggleWishlist,
  };
}
