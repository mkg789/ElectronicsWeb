import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";

import { useProduct } from "./hooks";
import ProductDetails from "./ProductDetails";
import { useCartContext } from "../cart/CartContext";
import Loader from "../../shared/components/Loader";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const { product, loading } = useProduct(id);
  const { cart, wishlist, addToCart, addToWishlist } = useCartContext();

  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    type: "info",
  });
  const [actionLoading, setActionLoading] = useState(false);

  const inCart = useMemo(
    () => cart?.some(i => i.productId?._id === id),
    [cart, id]
  );

  const inWishlist = useMemo(
    () => wishlist?.some(i => i.productId?._id === id),
    [wishlist, id]
  );

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const showSnackbar = useCallback((msg, type = "info") => {
    if (!mountedRef.current) return;
    setSnackbar({ open: true, msg, type });
  }, []);

  const requireAuth = useCallback(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return false;
    }
    return true;
  }, [navigate]);

  const handleCart = useCallback(async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    try {
      await addToCart(product);
      showSnackbar("Added to cart 🛒", "success");
    } catch {
      showSnackbar("Failed to add to cart.", "error");
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  }, [product, addToCart, requireAuth, showSnackbar]);

  const handleWishlist = useCallback(async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    try {
      await addToWishlist(product);
      showSnackbar("Added to wishlist ❤️", "success");
    } catch {
      showSnackbar("Failed to add to wishlist.", "error");
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  }, [product, addToWishlist, requireAuth, showSnackbar]);

  if (loading) return <Loader fullPage message="Loading product..." />;

  if (!product) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error.main">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, md: 5 },
      }}
    >
      {/* Product Title */}
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{
          mb: { xs: 2, md: 3 },
          textAlign: { xs: "center", md: "left" },
          wordBreak: "break-word",
        }}
      >
        {product.name}
      </Typography>

      {/* Product Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 3 },
        }}
      >
        <ProductDetails
          product={product}
          inCart={inCart}
          inWishlist={inWishlist}
          loading={actionLoading}
          onAddToCart={handleCart}
          onAddToWishlist={handleWishlist}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() =>
          setSnackbar(prev => ({ ...prev, open: false }))
        }
      >
        <Alert
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
